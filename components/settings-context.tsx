"use client";
import { createContext, useContext } from "react";
export type UserSettings = { unit: "kg" | "lb"; tz?: string };
const Ctx = createContext<UserSettings>({ unit: "kg" });
export const SettingsProvider = ({ value, children }: { value: UserSettings; children: React.ReactNode }) => <Ctx.Provider value={value}>{children}</Ctx.Provider>;
export const useSettings = () => useContext(Ctx);
