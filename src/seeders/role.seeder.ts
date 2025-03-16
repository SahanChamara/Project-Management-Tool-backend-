import "dotenv/config";
import connectDatabase from "../config/database.config";
import mongoose from "mongoose";
import RoleModel from "../models/role-permission.model";
import { RolePermission } from "../utils/role-permission";

const seedRoles = async () => {
    console.log("Seeding started...");

    try {
        await connectDatabase();

        const session = await mongoose.startSession();
        session.startTransaction();

        console.log("existing roles clearing...");
        await RoleModel.deleteMany({}, { session });

        for (const roleName in RolePermission) {
            const role = roleName as keyof typeof RolePermission;
            const permissions = RolePermission[role];

            //checking role already exist
            const existingRole = await RoleModel.findOne({ name: role }).session(
                session
            );
            if (!existingRole) {
                const newRole = new RoleModel({
                    name: role,
                    permissions: permissions,
                });
                await newRole.save({ session });
                console.log(`Role ${role} add with perission`);

            } else {
                console.log(`Role ${role} exist`);
            }
        }

        await session.commitTransaction();
        console.log("comited");

        session.endSession();
        console.log("ended");

        console.log("seeding succesfull");        

    } catch (error) {
        console.log("error on seeding",error);
    }
};

seedRoles().catch((error) => 
    console.error("error on seed script",error)
);