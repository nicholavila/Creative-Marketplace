import { Navbar } from "./_components/navbar";
import { Sdiebar } from "./_components/sidebar";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div className="w-full flex flex-col pt-6">
      <Navbar />
      <div className="w-full flex">
        <Sdiebar />
        {children}
      </div>
    </div>
  );
};

export default ProtectedLayout;