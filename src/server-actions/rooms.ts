'use server'
import { connectMongoDB } from "@/config/db";
import RoomModel from "@/models/room-model";
import { revalidatePath } from "next/cache";
connectMongoDB();

export const AddRoom = async (payload: any) => {
    try {

        console.log("payload", payload);

        {/**

          payload {
          hotel: '66ad12c47b9adc692a78dea2',
          name: 'Special S1',
          roomNumber: '100',
          type: 'premium',
          bedrooms: '1',
          rentPerDay: '1000',
          amenities: 'TV,AC,Pool',
          media: [
          'https://firebasestorage.googleapis.com/v0/b/happytrip-2efba.appspot.com/o/images%2FIMG-20171222-WA0153.jpg?alt=media&token=6f65d928-1783-4edf-9c50-4a5d55d9e607'
          ]
          }

        */}

        const newRoom = new RoomModel(payload);
        await newRoom.save();
        revalidatePath("/admin/rooms");
        return {
            success: true,
            message: "Room added successfully",
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
        };
    }
};

export const EditRoom = async ({
    roomId,
    payload,
}: {
    roomId: string;
    payload: any;
}) => {
    try {
        await RoomModel.findByIdAndUpdate(roomId, payload);
        revalidatePath("/admin/rooms");
        return {
            success: true,
            message: "Room updated successfully",
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
        };
    }
};

export const DeleteRoom = async (roomId: string) => {
    try {
        await RoomModel.findByIdAndDelete(roomId);
        revalidatePath("/admin/rooms");
        return {
            success: true,
            message: "Room deleted successfully",
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
        };
    }
};
