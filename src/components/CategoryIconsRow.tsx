import { Home, Monitor, Gamepad, Smartphone, Camera, Cpu } from "lucide-react";

const CategoryIconsRow = () => {
  const categories: [string, React.ReactNode][] = [
    ["Home", <Home key="home" className="h-5 w-5" />],
    ["Computers", <Monitor key="monitor" className="h-5 w-5" />],
    ["Gaming", <Gamepad key="gamepad" className="h-5 w-5" />],
    ["Phones", <Smartphone key="phone" className="h-5 w-5" />],
    ["Components", <Cpu key="cpu" className="h-5 w-5" />],
    ["Photography", <Camera key="camera" className="h-5 w-5" />],
  ];

  return (
    <div className="relative z-20 mt-6">
      <div className="mx-auto w-full max-w-7xl px-4">
        {/* Mobile: horizontal scrollable pills */}
        <div className="-mx-2 flex gap-3 overflow-x-auto py-2 lg:hidden">
          {categories.map(([name, icon]) => (
            <button
              key={name}
              className="flex flex-shrink-0 items-center gap-2 rounded-md border border-gray-100 bg-white px-3 py-2 text-sm text-slate-800 hover:bg-gray-100"
            >
              <span className="text-lg text-slate-800">{icon}</span>
              <span className="text-slate-800">{name}</span>
            </button>
          ))}
        </div>

        {/* Desktop: centered rounded container */}
        <div className="hidden items-center justify-center gap-4 rounded-xl bg-white p-3 shadow-sm lg:flex">
          {categories.map(([name, icon]) => (
            <button
              key={name}
              className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-100 bg-white px-3 py-2 text-sm text-slate-800 hover:bg-gray-100"
            >
              <span className="text-lg text-slate-800">{icon}</span>
              <span className="text-slate-800">{name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryIconsRow;
