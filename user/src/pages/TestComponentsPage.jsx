import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetClose
} from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar } from "@/components/ui/avatar";
import { Camera, Menu, ChevronDown, Mail, Settings, LogOut } from "lucide-react";

export default function TestComponentsPage() {
    const [inputValue, setInputValue] = useState("");

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <h1 className="text-3xl font-bold mb-8">🧪 Test Shadcn/UI Components</h1>

            {/* Test Buttons */}
            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">1️⃣ Buttons</h2>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-wrap gap-3">
                            <Button>Default</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="destructive">Destructive</Button>
                            <Button variant="outline">Outline</Button>
                            <Button variant="ghost">Ghost</Button>
                            <Button variant="link">Link</Button>
                            <Button disabled>Disabled</Button>
                            <Button size="sm">Small</Button>
                            <Button size="lg">Large</Button>
                            <Button>
                                <Camera className="mr-2 h-4 w-4" />
                                With Icon
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Test Inputs */}
            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">2️⃣ Inputs</h2>
                <Card>
                    <CardContent className="pt-6 space-y-4">
                        <div>
                            <Input
                                placeholder="Enter your email"
                                type="email"
                            />
                        </div>
                        <div>
                            <Input
                                placeholder="Password"
                                type="password"
                            />
                        </div>
                        <div>
                            <Input
                                placeholder="Disabled input"
                                disabled
                            />
                        </div>
                        <div>
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Type something..."
                            />
                            <p className="mt-2 text-sm text-muted-foreground">
                                You typed: {inputValue}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Test Cards */}
            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">3️⃣ Cards</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Card Title</CardTitle>
                            <CardDescription>Card description goes here</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>This is the card content area.</p>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full">Action Button</Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Another Card</CardTitle>
                            <CardDescription>With different content</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Cards are very flexible components!</p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Test Sheet (Drawer) */}
            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">4️⃣ Sheet (Drawer/Sidebar)</h2>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-wrap gap-3">
                            {/* Left Sheet */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline">
                                        <Menu className="mr-2 h-4 w-4" />
                                        Open Left
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left">
                                    <SheetHeader>
                                        <SheetTitle>Left Sidebar</SheetTitle>
                                        <SheetDescription>
                                            This is a sheet opening from the left side.
                                        </SheetDescription>
                                    </SheetHeader>
                                    <div className="py-4">
                                        <p>Sheet content goes here...</p>
                                    </div>
                                    <SheetFooter>
                                        <SheetClose asChild>
                                            <Button>Close</Button>
                                        </SheetClose>
                                    </SheetFooter>
                                </SheetContent>
                            </Sheet>

                            {/* Right Sheet */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline">Open Right</Button>
                                </SheetTrigger>
                                <SheetContent side="right">
                                    <SheetHeader>
                                        <SheetTitle>Right Sidebar</SheetTitle>
                                        <SheetDescription>
                                            This is a sheet opening from the right side.
                                        </SheetDescription>
                                    </SheetHeader>
                                    <div className="py-4">
                                        <p>Perfect for mobile menus or filters!</p>
                                    </div>
                                </SheetContent>
                            </Sheet>

                            {/* Top Sheet */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline">Open Top</Button>
                                </SheetTrigger>
                                <SheetContent side="top">
                                    <SheetHeader>
                                        <SheetTitle>Top Sheet</SheetTitle>
                                        <SheetDescription>
                                            Opening from the top!
                                        </SheetDescription>
                                    </SheetHeader>
                                </SheetContent>
                            </Sheet>

                            {/* Bottom Sheet */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline">Open Bottom</Button>
                                </SheetTrigger>
                                <SheetContent side="bottom">
                                    <SheetHeader>
                                        <SheetTitle>Bottom Sheet</SheetTitle>
                                        <SheetDescription>
                                            Great for mobile actions!
                                        </SheetDescription>
                                    </SheetHeader>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Test Dropdown Menu */}
            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">5️⃣ Dropdown Menu</h2>
                <Card>
                    <CardContent className="pt-6">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    Open Menu
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Mail className="mr-2 h-4 w-4" />
                                    <span>Messages</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Logout</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </CardContent>
                </Card>
            </section>

            {/* Test Avatar */}
            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">6️⃣ Avatar</h2>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <Avatar>
                                <img src="https://github.com/shadcn.png" alt="Avatar" />
                            </Avatar>
                            <Avatar>
                                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500" />
                            </Avatar>
                            <Avatar>
                                <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-bold">
                                    JD
                                </div>
                            </Avatar>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Test Dark Mode Toggle */}
            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">7️⃣ Dark Mode</h2>
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground mb-4">
                            Check the theme toggle in your HeaderMain to test dark mode!
                        </p>
                        <div className="p-4 bg-muted rounded-lg">
                            <p>This background adapts to light/dark mode</p>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Status Report */}
            <section className="mb-12">
                <Card className="border-green-500">
                    <CardHeader>
                        <CardTitle className="text-green-600">✅ Test Complete!</CardTitle>
                        <CardDescription>
                            If you can see and interact with all components above, shadcn/ui is working perfectly!
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <h3 className="font-semibold mb-2">Checklist:</h3>
                        <ul className="space-y-1 text-sm">
                            <li>✅ Buttons have different variants and hover effects</li>
                            <li>✅ Inputs are styled and functional</li>
                            <li>✅ Cards display with proper shadows and borders</li>
                            <li>✅ Sheets open from all sides smoothly</li>
                            <li>✅ Dropdown menus appear on click</li>
                            <li>✅ Avatars display properly</li>
                            <li>✅ Dark mode toggle works (if implemented)</li>
                        </ul>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}