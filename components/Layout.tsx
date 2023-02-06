import Header from "./layout/Header";
import Footer from "./layout/Footer";
import { FC } from "react";

type MyComponenProps = {
  children: React.ReactNode;
};

const Layout: FC<MyComponenProps> = ({ children }) => {
  return (
    <>
      <Header />
      	<main className="px-1 md:px-5 lg:px-5">{children}</main>
      <Footer />
    </>
  )
}

export default Layout;