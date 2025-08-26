"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAdmins = exports.seedDeliveryPersonnel = exports.seedReceivers = exports.seedSenders = exports.seedDummyUsers = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../config/env");
const user_interface_1 = require("../modules/user/user.interface");
const user_model_1 = require("../modules/user/user.model");
const dummyUsers = [
    // Senders
    {
        name: "John Doe",
        role: user_interface_1.Role.SENDER,
        email: "john.sender@parcel.com",
        password: "sender123",
        phone: "01733333333",
        defaultAddress: "789 Park Ave",
        isVerified: true,
    },
    {
        name: "Walter White",
        role: user_interface_1.Role.SENDER,
        email: "walter.sender@parcel.com",
        password: "sender123",
        phone: "01711111111",
        defaultAddress: "123 Sender st",
        isVerified: true,
    },
    {
        name: "Alice Smith",
        role: user_interface_1.Role.SENDER,
        email: "alice.sender@parcel.com",
        password: "sender123",
        phone: "01722222222",
        defaultAddress: "456 5th Ave",
        isVerified: true,
    },
    {
        name: "Jane Smith",
        role: user_interface_1.Role.SENDER,
        email: "jane.sender@parcel.com",
        password: "sender123",
        phone: "01744444444",
        defaultAddress: "321 Sender st",
        isVerified: true,
    },
    // Receivers
    {
        name: "Bob Smith",
        role: user_interface_1.Role.RECEIVER,
        email: "bob.receiver@parcel.com",
        password: "receiver123",
        phone: "01733333333",
        defaultAddress: "789 Park Ave",
        isVerified: true,
    },
    {
        name: "Sarah Wilson",
        role: user_interface_1.Role.RECEIVER,
        email: "sarah.receiver@parcel.com",
        password: "receiver123",
        phone: "01744444444",
        defaultAddress: "321 Lex Ave",
        isVerified: true,
    },
    {
        name: "Mike Davis",
        role: user_interface_1.Role.RECEIVER,
        email: "mike.receiver@parcel.com",
        password: "receiver123",
        phone: "01755555555",
        defaultAddress: "654 six ave",
        isVerified: true,
    },
    {
        name: "Emily Johnson",
        role: user_interface_1.Role.RECEIVER,
        email: "emily.receiver@parcel.com",
        password: "receiver123",
        phone: "01766666666",
        defaultAddress: "111 42nd St",
        isVerified: true,
    },
    {
        name: "Michael Brown",
        role: user_interface_1.Role.RECEIVER,
        email: "michael.receiver@parcel.com",
        password: "receiver123",
        phone: "01777777777",
        defaultAddress: "222 3rd Ave",
        isVerified: true,
    },
    // Delivery Personnel
    {
        name: "Ahmed Rahman",
        role: user_interface_1.Role.DELIVERY_PERSONNEL,
        email: "ahmed.delivery@parcel.com",
        password: "delivery123",
        phone: "01766666666",
        defaultAddress: "111 42nd St",
        isVerified: true,
    },
    {
        name: "Fatima Khatun",
        role: user_interface_1.Role.DELIVERY_PERSONNEL,
        email: "fatima.delivery@parcel.com",
        password: "delivery123",
        phone: "01777777777",
        defaultAddress: "222 3rd Ave",
        isVerified: true,
    },
    {
        name: "Karim Uddin",
        role: user_interface_1.Role.DELIVERY_PERSONNEL,
        email: "karim.delivery@parcel.com",
        password: "delivery123",
        phone: "01788888888",
        defaultAddress: "333 Wall St",
        isVerified: true,
    },
    {
        name: "Richard Roe",
        role: user_interface_1.Role.DELIVERY_PERSONNEL,
        email: "richard.delivery@parcel.com",
        password: "delivery123",
        phone: "01799999999",
        defaultAddress: "999 Admin st, Dhaka",
        isVerified: true,
    },
    // Admins
    {
        name: "Admin One",
        role: user_interface_1.Role.ADMIN,
        email: "admin@parcel.com",
        password: "admin123",
        phone: "01799999999",
        defaultAddress: "999 Admin st, Dhaka",
        isVerified: true,
    },
    {
        name: "Admin Two",
        role: user_interface_1.Role.ADMIN,
        email: "admin2@parcel.com",
        password: "admin123",
        phone: "01788888888",
        defaultAddress: "888 Admin st",
        isVerified: true,
    },
];
const seedDummyUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Checking for existing dummy users...");
        for (const userData of dummyUsers) {
            const existingUser = yield user_model_1.User.findOne({ email: userData.email });
            if (existingUser) {
                console.log(`User ${userData.name} (${userData.email}) already exists!`);
                continue;
            }
            console.log(`Creating user: ${userData.name} (${userData.role})...`);
            // Hash password
            const hashedPassword = yield bcryptjs_1.default.hash(userData.password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
            // Create user payload
            const userPayload = {
                name: userData.name,
                role: userData.role,
                email: userData.email,
                password: hashedPassword,
                phone: userData.phone,
                defaultAddress: userData.defaultAddress,
                isVerified: userData.isVerified,
            };
            // Create user
            const newUser = yield user_model_1.User.create(userPayload);
            console.log(`✅ Created: ${newUser.name} (${newUser.role})`);
        }
        console.log("\n🎉 Dummy users seeding completed!");
        // Print summary
        const summary = yield getSeedingSummary();
        console.log("\n📊 Users Summary:");
        console.table(summary);
    }
    catch (error) {
        console.error("❌ Error seeding dummy users:", error);
    }
});
exports.seedDummyUsers = seedDummyUsers;
// Helper function to get seeding summary
const getSeedingSummary = () => __awaiter(void 0, void 0, void 0, function* () {
    const senders = yield user_model_1.User.countDocuments({ role: user_interface_1.Role.SENDER });
    const receivers = yield user_model_1.User.countDocuments({ role: user_interface_1.Role.RECEIVER });
    const delivery = yield user_model_1.User.countDocuments({ role: user_interface_1.Role.DELIVERY_PERSONNEL });
    const admins = yield user_model_1.User.countDocuments({ role: user_interface_1.Role.ADMIN });
    const superAdmins = yield user_model_1.User.countDocuments({ role: user_interface_1.Role.SUPER_ADMIN });
    return {
        Senders: senders,
        Receivers: receivers,
        "Delivery Personnel": delivery,
        Admins: admins,
        "Super Admins": superAdmins,
        Total: senders + receivers + delivery + admins + superAdmins,
    };
});
// Individual role seeders (optional)
const seedSenders = () => __awaiter(void 0, void 0, void 0, function* () {
    const senders = dummyUsers.filter((user) => user.role === user_interface_1.Role.SENDER);
    yield seedSpecificUsers(senders, "Senders");
});
exports.seedSenders = seedSenders;
const seedReceivers = () => __awaiter(void 0, void 0, void 0, function* () {
    const receivers = dummyUsers.filter((user) => user.role === user_interface_1.Role.RECEIVER);
    yield seedSpecificUsers(receivers, "Receivers");
});
exports.seedReceivers = seedReceivers;
const seedDeliveryPersonnel = () => __awaiter(void 0, void 0, void 0, function* () {
    const deliveryPersonnel = dummyUsers.filter((user) => user.role === user_interface_1.Role.DELIVERY_PERSONNEL);
    yield seedSpecificUsers(deliveryPersonnel, "Delivery Personnel");
});
exports.seedDeliveryPersonnel = seedDeliveryPersonnel;
const seedAdmins = () => __awaiter(void 0, void 0, void 0, function* () {
    const admins = dummyUsers.filter((user) => user.role === user_interface_1.Role.ADMIN);
    yield seedSpecificUsers(admins, "Admins");
});
exports.seedAdmins = seedAdmins;
// Helper function for specific role seeding
const seedSpecificUsers = (users, roleType) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`\nSeeding ${roleType}...`);
        for (const userData of users) {
            const existingUser = yield user_model_1.User.findOne({ email: userData.email });
            if (existingUser) {
                console.log(`${userData.name} already exists!`);
                continue;
            }
            const hashedPassword = yield bcryptjs_1.default.hash(userData.password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
            const userPayload = Object.assign(Object.assign({}, userData), { password: hashedPassword });
            const newUser = yield user_model_1.User.create(userPayload);
            console.log(`✅ Created: ${newUser.name}`);
        }
        console.log(`🎉 ${roleType} seeding completed!`);
    }
    catch (error) {
        console.error(`❌ Error seeding ${roleType}:`, error);
    }
});
