"use client";

import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="mt-16 border-t bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-8 md:flex-row">
        {/* Left */}
        <div>
          <h2 className="text-2xl font-bold text-violet-700">
            Inventra
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Smart Inventory Management System
          </p>
        </div>

        {/* Center */}
        <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link
            href="/"
            className="transition hover:text-violet-600"
          >
            Home
          </Link>

          <Link
            href="/inventory"
            className="transition hover:text-violet-600"
          >
            Inventory
          </Link>

          <Link
            href="/billing"
            className="transition hover:text-violet-600"
          >
            Billing
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button className="rounded-full border p-2 text-gray-500 transition hover:border-violet-500 hover:text-violet-600">
            <FaFacebookF size={16} />
          </button>

          <button className="rounded-full border p-2 text-gray-500 transition hover:border-violet-500 hover:text-violet-600">
            <FaInstagram size={16} />
          </button>

          <button className="rounded-full border p-2 text-gray-500 transition hover:border-violet-500 hover:text-violet-600">
            <FaLinkedinIn size={16} />
          </button>

          <button className="rounded-full border p-2 text-gray-500 transition hover:border-violet-500 hover:text-violet-600">
            <FaTwitter size={16} />
          </button>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t py-4 text-center text-sm text-gray-400">
        © 2026 Inventra. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;