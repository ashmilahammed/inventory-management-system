import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "../../infrastructure/database/connection";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { HashService } from "../../infrastructure/services/HashService";

const seedAdmin = async () => {

    try {

        await connectDB();

        const userRepository = new UserRepository();

        const hashService = new HashService();

        const existingAdmin =
            await userRepository.findByEmail(
                "admin@gmail.com"
            );

        if (existingAdmin) {

            console.log("Admin already exists");

            process.exit();
        }

        const hashedPassword =
            await hashService.hashPassword(
                "admin123"
            );

        await userRepository.create({
            name: "Admin",

            email: "admin@gmail.com",

            password: hashedPassword,

            role: "admin"
        });

        console.log("Admin created successfully");

        process.exit();

    } catch (error) {

        console.log(error);

        process.exit(1);
    }
};

seedAdmin().catch(console.error);