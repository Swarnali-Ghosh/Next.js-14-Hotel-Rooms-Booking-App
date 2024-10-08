"use server";
import { connectMongoDB } from "@/config/db";
import { GetCurrentUserFromMongoDB } from "./users";
import { revalidatePath } from "next/cache";
import RoomModel from "@/models/room-model";
import BookingModel from "@/models/booking-model";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


connectMongoDB();

export const CheckRoomAvailability = async ({
    roomId,
    reqCheckInDate,
    reqCheckOutDate
}: {
    roomId: string,
    reqCheckInDate: string,
    reqCheckOutDate: string
}) => {
    try {

        console.log(roomId,
            reqCheckInDate,
            reqCheckOutDate);

        const reqCheckInDateObj = new Date(reqCheckInDate);
        const reqCheckOutDateObj = new Date(reqCheckOutDate);


        const bookedSlots = await BookingModel.findOne({
            room: roomId,
            $or: [
                {
                    checkInDate: {
                        $gte: reqCheckInDateObj,
                        $lte: reqCheckOutDateObj,
                    },
                },
                {
                    checkOutDate: {
                        $gte: reqCheckInDateObj,
                        $lte: reqCheckOutDateObj,
                    },
                },
                {
                    $and: [
                        { checkInDate: { $lte: reqCheckInDateObj } },
                        { checkOutDate: { $gte: reqCheckOutDateObj } },
                    ],
                },
            ],
        });


        console.log("bookedSlots", bookedSlots);

        if (bookedSlots) {
            // means slot is already booked
            return {
                success: false
            }
        }

        return {
            success: true
        }

    } catch (error: any) {
        return {
            success: false,
            messages: error.message
        }
    }
}

export const BookRoom = async (payload: any) => {
    try {
        const userResponse = await GetCurrentUserFromMongoDB();
        payload.user = userResponse.data._id;
        const booking = new BookingModel(payload);
        await booking.save();
        revalidatePath("/user/bookings");
        return {
            success: true,
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message,
        };
    }
};

export const CancelBooking = async ({
    bookingId,
    paymentId,
}: {
    bookingId: string;
    paymentId: string;
}) => {
    try {

        console.log("bookingId", bookingId);
        console.log("paymentId", paymentId);

        // change the status of the booking to cancelled
        await BookingModel.findByIdAndUpdate(bookingId, {
            bookingStatus: "Cancelled",
        });

        // refund the payment

        const refund = await stripe.refunds.create({
            payment_intent: paymentId,
        });

        if (refund.status !== "succeeded") {
            return {
                success: false,
                message:
                    "Your booking has been cancelled but the refund failed. Please contact support for further assistance.",
            };
        }

        revalidatePath("/user/bookings");
        return {
            success: true,
            message:
                "Your booking has been cancelled and the refund has been processed.",
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message,
        };
    }
};

export const GetAvailableRooms = async ({
    reqCheckInDate,
    reqCheckOutDate,
    type,
}: {
    reqCheckInDate: string;
    reqCheckOutDate: string;
    type: string;
}) => {
    try {
        // if checkin date or checkout date is not valid return data only with type filter
        if (!reqCheckInDate || !reqCheckOutDate) {
            const rooms = await RoomModel.find({
                ...(type && { type }),
            }).populate("hotel");
            return {
                success: true,
                data: JSON.parse(JSON.stringify(rooms)),
            };
        }

        // first get all the rooms which are booked in the given date range
        const bookedSlots = await BookingModel.find({
            bookingStatus: "Booked",
            $or: [
                {
                    checkInDate: {
                        $gte: reqCheckInDate,
                        $lte: reqCheckOutDate,
                    },
                },
                {
                    checkOutDate: {
                        $gte: reqCheckInDate,
                        $lte: reqCheckOutDate,
                    },
                },
                {
                    $and: [
                        { checkInDate: { $lte: reqCheckInDate } },
                        { checkOutDate: { $gte: reqCheckOutDate } },
                    ],
                },
            ],
        });

        const bookedRoomIds = bookedSlots.map((slot) => slot.room);

        // get all the rooms by excluding the booked rooms
        const rooms = await RoomModel.find({
            _id: { $nin: bookedRoomIds },
            ...(type && { type }),
        }).populate("hotel");

        return {
            success: true,
            data: JSON.parse(JSON.stringify(rooms)),
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message,
        };
    }
};