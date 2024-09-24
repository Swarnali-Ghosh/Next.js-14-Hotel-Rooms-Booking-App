"use server";

import { connectMongoDB } from "@/config/db";
import RoomModel from "@/models/room-model";
import { revalidatePath } from "next/cache";

export const AddRoom = async (payload: any) => {
    try {
        await connectMongoDB(); // Ensure DB connection is established
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
        await connectMongoDB(); // Ensure DB connection is established
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
        await connectMongoDB(); // Ensure DB connection is established
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
