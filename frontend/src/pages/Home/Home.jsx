import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import TravelStoryCard from "../../components/Cards/TravelStoryCard";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const Home = () => {
	const [userInfo, setUserInfo] = useState({});
	const [allStories, setAllStories] = useState([]);

	const navigate = useNavigate();

	const getAllTravelStories = async () => {
		try {
			const response = await axiosInstance.get("/get-all-travel-stories");
			if (response.data && response.data.stories) {
				setAllStories(response.data.stories);
			}
		} catch (error) {
			console.log("An unexpected error occurred. Please try again.");
		}
	};

	const getUserInfo = async () => {
		try {
			const response = await axiosInstance.get("/get-user");
			if (response.data && response.data.user) {
				setUserInfo(response.data.user);
			}
		} catch (error) {
			if (error.response.status === 401) {
				localStorage.clear();
				navigate("/login");
			}
		}
	};

	const handleEdit = (data) => {};

	const handleViewStory = (data) => {};

	const updateIsFavorite = async (storyData) => {
		const storyId = storyData._id;

		try {
			const response = await axiosInstance.put(`/update-is-favorite/${storyId}`, {
				isFavorite: !storyData.isFavorite,
			});

			if (response.data && response.data.story) {
				getAllTravelStories();
			}
		} catch (error) {
			console.log("An unexpected error occurred. Please try again.");
		}
	};

	useEffect(() => {
		getAllTravelStories();
		getUserInfo();

		return () => {};
	}, []);

	return (
		<>
			<Navbar userInfo={userInfo} />

			<div className="container mx-auto py-10">
				<div className="flex gap-7">
					<div className="flex-1">
						{allStories.length > 0 ? (
							<div className="grid grid-cols-2 gap-4">
								{allStories.map((item) => {
									return (
										<TravelStoryCard
											key={item._id}
											imgUrl={item.imageUrl}
											title={item.title}
											story={item.story}
											date={item.visitedDate}
											visitedLocation={item.visitedLocation}
											isFavorite={item.isFavorite}
											onEdit={() => handleEdit(item)}
											onClick={() => handleViewStory(item)}
											onFavoriteClick={() => updateIsFavorite(item)}
										/>
									);
								})}
							</div>
						) : (
							<>Empty Card Here</>
						)}
						<div className="w-[320px]"></div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Home;
