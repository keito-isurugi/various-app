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
      	<main className="p-5">{children}</main>
      <Footer />
    </>
  )
}

export default Layout;