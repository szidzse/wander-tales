import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";

const App = () => {
	return (
		<div>
			<Router>
				<Routes>
					<Route path="/" element={<Root />} />
					<Route path="/dashboard" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<SignUp />} />
				</Routes>
			</Router>
		</div>
	);
};

const Root = () => {
	const isAuthenticated = !!localStorage.getItem("token");

	return isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
};

export default App;
