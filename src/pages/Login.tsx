import { LoginForm } from "@/components/login-form";

const Login = () => {
  return (
    <div className="flex min-h-screen">
      <div className="flex w-full">
        <div className="flex h-full flex-1 flex-col justify-between bg-[#EDE8D0] px-14 py-10">
          <a href="/">
            <img
              src="Salt_Logo.svg"
              alt="logo"
              className="h-16 w-16 object-contain"
            />
          </a>
          <p className="text-md italic text-[#0e0202]">
            "Your go-to platform for comparing prices on electronic devices.
            Find the best deals on smartphones, laptops, and accessories from
            top retailers all in one place." - Thang Salt
          </p>
        </div>
        <div className="flex h-full flex-1 flex-col items-center justify-center p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
