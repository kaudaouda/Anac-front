import React from 'react';
import SubNav from './SubNav';
import NewsInfo from './NewsInfo';
import Header from './Header';
import Menu from './Menu';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <SubNav />
      <NewsInfo />
      <Header />
      <Menu />

      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
