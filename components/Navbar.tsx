import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-black text-white px-8 py-4 flex gap-6">
      <Link href="/">
        Home
      </Link>

      <Link href="/menu">
        Menu
      </Link>

      <Link href="/cart">
        Cart
      </Link>

      <Link href="/orders">
        Orders
      </Link>

      <Link href="/admin">
        Admin
      </Link>
    </nav>
  );
}