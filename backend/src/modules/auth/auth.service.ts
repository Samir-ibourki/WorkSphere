import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../prisma/client.js";
import type { LoginInput, RegisterInput } from "./auth.schema.js";

const generateToken = (payload: { userId: string; organizationId: string }) => {
  const secret = process.env.JWT_SECRET || "default_jwt_secret_dev";
  return jwt.sign(payload, secret, {
    expiresIn: "7d",
  });
};

const createSlug = (name: string): string => {
  const clean = name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${clean}-${Date.now().toString().slice(-4)}`;
};

export const authService = {
  // Register
  async register(input: RegisterInput) {
    const existUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existUser) {
      throw new Error("This email is already registered");
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    const slug = createSlug(input.organizationName);

    const organization = await prisma.organization.create({
      data: {
        name: input.organizationName,
        slug,
        users: {
          create: {
            name: input.name,
            email: input.email,
            password: hashedPassword,
          },
        },
      },
      include: {
        users: true,
      },
    });

    const newUser = organization.users[0]!;

    const token = generateToken({
      userId: newUser.id,
      organizationId: organization.id,
    });

    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        organizationId: organization.id,
      },
      organization: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
      },
      token,
    };
  },

  // Login
  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
      include: { organization: true },
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const token = generateToken({
      userId: user.id,
      organizationId: user.organizationId,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        organizationId: user.organizationId,
      },
      organization: {
        id: user.organization.id,
        name: user.organization.name,
        slug: user.organization.slug,
      },
      token,
    };
  },

  // Get Current Authenticated User (Me)
  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { organization: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        organizationId: user.organizationId,
        createdAt: user.createdAt,
      },
      organization: {
        id: user.organization.id,
        name: user.organization.name,
        slug: user.organization.slug,
      },
    };
  },
};
