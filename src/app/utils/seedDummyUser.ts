import bcryptjs from "bcryptjs";
import { envVars } from "../config/env";
import { IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

const dummyUsers = [
  // Senders
  {
    name: "John Doe",
    role: Role.SENDER,
    email: "john.sender@example.com",
    password: "sender123",
    phone: "01711111111",
    defaultAddress: "123 Sender Street, Dhaka",
    isVerified: true,
  },
  {
    name: "Alice Smith",
    role: Role.SENDER,
    email: "alice.sender@example.com",
    password: "sender123",
    phone: "01722222222",
    defaultAddress: "456 Business Avenue, Chittagong",
    isVerified: true,
  },

  // Receivers
  {
    name: "Bob Johnson",
    role: Role.RECEIVER,
    email: "bob.receiver@example.com",
    password: "receiver123",
    phone: "01733333333",
    defaultAddress: "789 Receiver Road, Sylhet",
    isVerified: true,
  },
  {
    name: "Sarah Wilson",
    role: Role.RECEIVER,
    email: "sarah.receiver@example.com",
    password: "receiver123",
    phone: "01744444444",
    defaultAddress: "321 Customer Lane, Rajshahi",
    isVerified: true,
  },
  {
    name: "Mike Davis",
    role: Role.RECEIVER,
    email: "mike.receiver@example.com",
    password: "receiver123",
    phone: "01755555555",
    defaultAddress: "654 Delivery Drive, Khulna",
    isVerified: true,
  },

  // Delivery Personnel
  {
    name: "Ahmed Rahman",
    role: Role.DELIVERY_PERSONNEL,
    email: "ahmed.delivery@example.com",
    password: "delivery123",
    phone: "01766666666",
    defaultAddress: "111 Delivery Hub, Dhaka",
    isVerified: true,
  },
  {
    name: "Fatima Khatun",
    role: Role.DELIVERY_PERSONNEL,
    email: "fatima.delivery@example.com",
    password: "delivery123",
    phone: "01777777777",
    defaultAddress: "222 Transport Center, Chittagong",
    isVerified: true,
  },
  {
    name: "Karim Uddin",
    role: Role.DELIVERY_PERSONNEL,
    email: "karim.delivery@example.com",
    password: "delivery123",
    phone: "01788888888",
    defaultAddress: "333 Logistics Point, Sylhet",
    isVerified: true,
  },

  // Admins
  {
    name: "Admin User",
    role: Role.ADMIN,
    email: "admin@example.com",
    password: "admin123",
    phone: "01799999999",
    defaultAddress: "999 Admin Office, Dhaka",
    isVerified: true,
  },
];

export const seedDummyUsers = async () => {
  try {
    console.log("Checking for existing dummy users...");

    for (const userData of dummyUsers) {
      const existingUser = await User.findOne({ email: userData.email });

      if (existingUser) {
        console.log(
          `User ${userData.name} (${userData.email}) already exists!`
        );
        continue;
      }

      console.log(`Creating user: ${userData.name} (${userData.role})...`);

      // Hash password
      const hashedPassword = await bcryptjs.hash(
        userData.password,
        Number(envVars.BCRYPT_SALT_ROUND)
      );

      // Create user payload
      const userPayload: IUser = {
        name: userData.name,
        role: userData.role,
        email: userData.email,
        password: hashedPassword,
        phone: userData.phone,
        defaultAddress: userData.defaultAddress,
        isVerified: userData.isVerified,
      };

      // Create user
      const newUser = await User.create(userPayload);
      console.log(`✅ Created: ${newUser.name} (${newUser.role})`);
    }

    console.log("\n🎉 Dummy users seeding completed!");

    // Print summary
    const summary = await getSeedingSummary();
    console.log("\n📊 Users Summary:");
    console.table(summary);
  } catch (error) {
    console.error("❌ Error seeding dummy users:", error);
  }
};

// Helper function to get seeding summary
const getSeedingSummary = async () => {
  const senders = await User.countDocuments({ role: Role.SENDER });
  const receivers = await User.countDocuments({ role: Role.RECEIVER });
  const delivery = await User.countDocuments({ role: Role.DELIVERY_PERSONNEL });
  const admins = await User.countDocuments({ role: Role.ADMIN });
  const superAdmins = await User.countDocuments({ role: Role.SUPER_ADMIN });

  return {
    Senders: senders,
    Receivers: receivers,
    "Delivery Personnel": delivery,
    Admins: admins,
    "Super Admins": superAdmins,
    Total: senders + receivers + delivery + admins + superAdmins,
  };
};

// Individual role seeders (optional)
export const seedSenders = async () => {
  const senders = dummyUsers.filter((user) => user.role === Role.SENDER);
  await seedSpecificUsers(senders, "Senders");
};

export const seedReceivers = async () => {
  const receivers = dummyUsers.filter((user) => user.role === Role.RECEIVER);
  await seedSpecificUsers(receivers, "Receivers");
};

export const seedDeliveryPersonnel = async () => {
  const deliveryPersonnel = dummyUsers.filter(
    (user) => user.role === Role.DELIVERY_PERSONNEL
  );
  await seedSpecificUsers(deliveryPersonnel, "Delivery Personnel");
};

export const seedAdmins = async () => {
  const admins = dummyUsers.filter((user) => user.role === Role.ADMIN);
  await seedSpecificUsers(admins, "Admins");
};

// Helper function for specific role seeding
const seedSpecificUsers = async (users: any[], roleType: string) => {
  try {
    console.log(`\nSeeding ${roleType}...`);

    for (const userData of users) {
      const existingUser = await User.findOne({ email: userData.email });

      if (existingUser) {
        console.log(`${userData.name} already exists!`);
        continue;
      }

      const hashedPassword = await bcryptjs.hash(
        userData.password,
        Number(envVars.BCRYPT_SALT_ROUND)
      );

      const userPayload: IUser = {
        ...userData,
        password: hashedPassword,
      };

      const newUser = await User.create(userPayload);
      console.log(`✅ Created: ${newUser.name}`);
    }

    console.log(`🎉 ${roleType} seeding completed!`);
  } catch (error) {
    console.error(`❌ Error seeding ${roleType}:`, error);
  }
};
