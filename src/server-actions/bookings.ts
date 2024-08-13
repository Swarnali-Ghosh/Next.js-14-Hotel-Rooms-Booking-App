"use server";
import { connectMongoDB } from "@/config/db";
import BookingModel from "@/models/booking-model";

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

        const bookedSlots = await BookingModel.findOne({
            room: roomId,
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
        //   const userResponse = await GetCurrentUserFromMongoDB();
        //   payload.user = userResponse.data._id;
        //   const booking = new BookingModel(payload);
        //   await booking.save();
        //   revalidatePath("/user/bookings");
        //   return {
        //     success: true,
        //   };
    } catch (error: any) {
        return {
            success: false,
            message: error.message,
        };
    }
};