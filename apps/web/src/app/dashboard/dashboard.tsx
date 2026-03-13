"use client";

import type { auth } from "@my-better-t-app/auth";

type Session = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;

interface DashboardProps {
	session: Session;
}

export default function Dashboard({ session }: DashboardProps) {
	return null;
}
