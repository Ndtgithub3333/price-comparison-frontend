import * as React from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { useUserStore } from "@/lib/userStore";

import { logout } from "@/services/userService";
import { toast } from "sonner";

const components: {
  title: string;
  to: string;
  srcImg: string;
  description: string;
}[] = [
  {
    title: "Smartphone",
    to: "/compare/smartphone",
    srcImg: "iphone.png",
    description:
      "Compare the latest smartphones, features, and prices from top brands.",
  },
  {
    title: "Laptop",
    to: "/compare/laptop",
    srcImg: "laptop.png",
    description: "Find the best deals on laptops for work, study, or gaming.",
  },
  {
    title: "Tablet",
    to: "/compare/tablet",
    srcImg: "ipad.png",
    description:
      "Explore tablets for entertainment, productivity, and portability.",
  },
  {
    title: "Earbuds",
    to: "/compare/earbuds",
    srcImg: "airpod.png",
    description: "Discover wireless earbuds with superior sound and comfort.",
  },
  {
    title: "Smartwatch",
    to: "/compare/smartwatch",
    srcImg: "apple_watch.png",
    description:
      "Track your health and stay connected with the latest smartwatches.",
  },
  {
    title: "Accessories",
    to: "/compare/accessories",
    srcImg: "accessories.png",
    description:
      "Browse essential accessories to enhance your devices and experience.",
  },
];

export function Header() {
  const user = useUserStore((state) => state.user);
  const isChecking = useUserStore((state) => state.isChecking);
  const logoutStore = useUserStore((state) => state.logout);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleLogout = async () => {
    try {
      await logout();
      logoutStore();
      navigate("/login", { replace: true }); // luôn chuyển về /login
    } catch {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    // full width header bar, inner content centered with same max-w as main/footer
    // ensure header (and its dropdowns) sits above the hero by giving it a high z-index
    <header className="relative z-50 w-full">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex w-full items-center justify-between">
          {/* left: logo */}
          <div className="flex items-center gap-4">
            <a href="/">
              <img
                src="Salt_Logo.svg"
                alt="logo"
                className="mr-0 h-12 w-12 object-contain"
              />
            </a>
          </div>

          {/* center: desktop navigation */}
          <div className="hidden lg:block">
            <NavigationMenu viewport={false}>
              <NavigationMenuList className="gap-3">
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-gray-50">
                    Home
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                            href="/"
                          >
                            <div className="mt-4 mb-2 rounded-xl bg-[linear-gradient(90deg,rgba(42,123,155,1)0%,rgba(87,199,133,1)50%,rgba(237,221,83,1)100%)] py-1 text-center text-lg font-medium">
                              priceCompare
                            </div>
                            <p className="text-muted-foreground text-sm leading-tight">
                              Search, compare, save and share the best product
                              deals
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <ListItem to="/about" title="About">
                        Learn more about our platform and team.
                      </ListItem>
                      <ListItem to="/how-to-use" title="How to Use">
                        Step-by-step guide to compare and find the best deals.
                      </ListItem>
                      <ListItem to="/sale" title="Sale">
                        Discover the latest promotions and discounts on
                        electronics.
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-gray-50">
                    All Categories
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[680px]">
                      {components.map((component) => (
                        <Link
                          key={component.title}
                          to={component.to}
                          className="flex cursor-pointer items-center gap-3 rounded p-2 transition hover:bg-gray-100"
                        >
                          <img
                            className="h-16 w-16 object-cover"
                            src={component.srcImg}
                            alt={component.title}
                          />
                          <div>
                            <div className="text-sm font-medium">
                              {component.title}
                            </div>
                            <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                              {component.description}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link to="/docs">Sale</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link to="/docs">How to use</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link to="/docs">About us</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* right: profile and mobile menu toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex">
              {isChecking ? (
                <div className="flex items-center">
                  <span className="text-sm text-gray-500">Loading...</span>
                </div>
              ) : user ? (
                <div className="flex items-center gap-2">
                  <Button asChild>
                    <Link to="/profile">
                      {user.email}{" "}
                      {user.role === "admin" && (
                        <span className="text-xs text-green-300">(Admin)</span>
                      )}
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="cursor-pointer"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  className="text-md flex items-center justify-center py-5"
                  asChild
                >
                  <Link to="/login">Login</Link>
                </Button>
              )}
            </div>

            {/* mobile toggle */}
            <button
              className="inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100 lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? (
                <X className="h-5 w-5 cursor-pointer" />
              ) : (
                <Menu className="h-5 w-5 cursor-pointer" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="bg-white shadow-md lg:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <nav className="flex flex-col gap-2">
              <Link to="/" className="py-2 text-sm font-medium">
                Home
              </Link>
              <div className="border-t" />
              <div className="pt-2">
                <div className="text-muted-foreground mb-2 text-xs uppercase">
                  Categories
                </div>
                <div className="flex flex-col gap-1">
                  {components.map((c) => (
                    <Link key={c.title} to={c.to} className="py-2 text-sm">
                      {c.title}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="border-t" />
              <Link to="/sale" className="py-2 text-sm">
                Sale
              </Link>
              <Link to="/how-to-use" className="py-2 text-sm">
                How to use
              </Link>
              <Link to="/about" className="py-2 text-sm">
                About us
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

function ListItem({
  title,
  children,
  to,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { to: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link to={to}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
