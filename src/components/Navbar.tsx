import React from 'react';
import { signIn, signOut, useSession } from "next-auth/react"

import Link from 'next/link';
import Image from "next/image";
import Avatar from "@/components/Avatar";
import Logo from "@/components/Logo";

const Navbar: React.FC = () => {
    const { data: session } = useSession()
    const defaultImage = "/default-avatar.jpg"; // Default avatar image

    return (
        <div className="w-full">
            <div className="navbar my-2 w-full bg-transparent">
                <div className="flex-1">
                    <Link href="/" className="btn btn-ghost text-xl">
                        <Logo />
                    </Link>
                </div>
                <div className="flex-none">
                    {session ?
                        (
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                    <Avatar
                                        userHandle={session.user?.userHandle}
                                        name={session.user?.name}
                                        imageUrl={session.user?.image || null}
                                        size={40}
                                    />
                                </div>
                                <ul
                                    tabIndex={0}
                                    className="menu menu-sm bg-secondary dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                                    <li>
                                        <Link href={session.user?.userHandle ? `/${session.user.userHandle}` : `/auth/get-handle?callbackUrl=${encodeURIComponent('/')}`} className="justify-between">
                                            <b>Profile</b>
                                        </Link>
                                    </li>
                                    <li><a onClick={(e) => signOut({callbackUrl: "/"})}><b>Logout</b></a></li>
                                </ul>
                            </div>
                        )
                        // The signin link redirects to login page /pages/auth/login.tsx
                        : <a onClick={(e) => signIn()} className="btn btn-accent text-primary">Login</a>
                    }
                </div>
            </div>
        </div>
    )

}

export default Navbar;