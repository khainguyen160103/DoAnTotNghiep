"use client";
import React, { useEffect, useRef, useState,useCallback , useMemo} from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "@/context/AuthContext";

import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
} from "../icons/index";
// import SidebarWidget from "./SidebarWidget";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
  requiredRole?: string;
};

const navItemsUser: NavItem[] = [
  {
    icon: <CalenderIcon />,
    name: "Chấm công",
    path: "/attendance",
  },
  {
    name: "Đơn",
    icon: <ListIcon />,
    path: "/submissionForm",
  },
  {
    name: "Bảng lương",
    icon: <PageIcon />,
    path: '/payroll',
  }
  ]
const navItemsAdmin: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Quản lý Người dùng",
    path: "/",  
  },
  {
    icon: <CalenderIcon />,
    name: "Quản lý chấm công",
    path: "/attendance",
  },
  {
    name: "Quản lý đơn",
    icon: <ListIcon />,
    path: "/submissionForm",
  },
    {
    name: "Quản lý lương",
    icon: <ListIcon />,
    path: "/payroll"
  },
  {
    name: "Báo cáo thống kê",
    icon: <PageIcon />,
    path: '/dashboard',
  },
];


const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const { isLoading, user } = useAuth();
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  // Sử dụng useMemo với giá trị mặc định
  const { menuItems, isMenuReady } = useMemo(() => {
    // Nếu đang loading, trả về mảng rỗng và false
    if (isLoading) {
      return { menuItems: [], isMenuReady: false };
    }
    
    // Nếu đã load xong, trả về menu items tương ứng
    return {
      menuItems: user?.role === 1 ? navItemsAdmin : navItemsUser,
      isMenuReady: true
    };
  }, [isLoading, user]); // Chỉ phụ thuộc vào isLoading và isAdmin

  const renderContent = () => {
    // Chỉ render skeleton khi chưa hydrate hoặc đang loading
    if (!hasHydrated || isLoading || !isMenuReady) {
      return (
        <ul className="flex flex-col gap-4">
          {Array(5).fill(0).map((_, index) => (
            <li key={index} className="px-3">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
              </div>
            </li>
          ))}
        </ul>
      );
    }

    // Nếu đã load xong, hiển thị menu items
    return (
      <ul className="flex flex-col gap-4">
        {menuItems.map((nav, index) => (
          <li key={nav.name} className="px-3">
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(index, "main")}
                className={`menu-item group ${
                  openSubmenu?.type === "main" && openSubmenu?.index === index
                    ? "menu-item-active"
                    : "menu-item-inactive"
                } cursor-pointer ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "lg:justify-start"
                }`}
              >
                <span
                  className={`${
                    openSubmenu?.type === "main" && openSubmenu?.index === index
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === "main" && openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              </button>
            ) : (
              nav.path && (
                <Link
                  href={nav.path}
                  className={`menu-item group ${
                    isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  }`}
                >
                  <span
                    className={`${
                      isActive(nav.path)
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    }`}
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text">{nav.name}</span>
                  )}
                </Link>
              )
            )}
          </li>
        ))}
      </ul>
    );
  };

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => path === pathname;
   const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`py-6 flex ${
        !isExpanded && !isHovered ? "lg:justify-center" : "justify-center"
      }`}
      >
        <Link href="/">
          <div className={`
            flex items-center justify-center 
            ${!isExpanded && !isHovered ? "w-12 h-12" : "w-[200px] h-12"}
            transition-all duration-300
          `}>
            {(!isExpanded && !isHovered) ? (
              <div className="flex items-center justify-center w-16 h-10 bg-blue-600 rounded-lg text-white font-bold text-xl">
                <h1 className="p-2.5">
                  DLM
                </h1>
              </div>
            ) : (
              <div className="flex flex-col">
                <h1 className="text-xl font-bold tracking-wider text-blue-600">
                  DLM DIGITAL
                </h1>
              </div>
            )}
          </div>
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
               {renderContent()}
            </div>

            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >                            
              </h2>
    
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
