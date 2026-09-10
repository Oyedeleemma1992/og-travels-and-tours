/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Packages from './pages/Packages';
import PackageDetails from './pages/PackageDetails';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import FlightBooking from './pages/FlightBooking';
import HotelReservation from './pages/HotelReservation';
import Blog from './pages/Blog';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="packages" element={<Packages />} />
          <Route path="packages/:id" element={<PackageDetails />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:id" element={<Services />} />
          <Route path="contact" element={<Contact />} />
          <Route path="flight-booking" element={<FlightBooking />} />
          <Route path="hotel-reservation" element={<HotelReservation />} />
          <Route path="blog" element={<Blog />} />
        </Route>
        <Route path="/admin/*" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
