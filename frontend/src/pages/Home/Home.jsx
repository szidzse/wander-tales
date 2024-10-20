import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import TravelStoryCard from "../../components/Cards/TravelStoryCard";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddEditTravelStory from "./AddEditTravelStory";
import ViewTravelStory from "./ViewTravelStory";
import EmptyCard from "../../components/Cards/EmptyCard";
import EmptyImg from "../../assets/images/placeholder.svg";
import { DayPicker } from "react-day-picker";

const Home = () => {
	const navigate = useNavigate();
	const [userInfo, setUserInfo] = useState({});
	const [allStories, setAllStories] = useState([]);

	const [searchQuery, setSearchQuery] = useState("");
	const [filterType, setFilterType] = useState("");

	const [dateRange, setDateRange] = useState({
		form: null,
		to: null,
	});

	const [openAddEditModal, setOpenAddEditModal] = useState({
		isShown: false,
		type: "add",
		data: null,
	});

	const [openViewModal, setOpenViewModal] = useState({
		isShown: false,
		data: null,
	});

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

	const handleEdit = (data) => {
		setOpenAddEditModal({
			isShown: true,
			type: "edit",
			data: data,
		});
	};

	const handleViewStory = (data) => {
		setOpenViewModal({ isShown: true, data });
	};

	const updateIsFavorite = async (storyData) => {
		const storyId = storyData._id;

		try {
			const response = await axiosInstance.put(`/update-is-favorite/${storyId}`, {
				isFavorite: !storyData.isFavorite,
			});

			if (response.data && response.data.story) {
				toast.success("Story updated successfully.");
				getAllTravelStories();
			}
		} catch (error) {
			console.log("An unexpected error occurred. Please try again.");
		}
	};

	const deleteTravelStory = async (data) => {
		const storyId = data._id;

		try {
			const response = await axiosInstance.delete(`/delete-travel-story/${storyId}`);

			if (response.data && !response.data.error) {
				toast.error("Story deleted successfully.");
				setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
				getAllTravelStories();
			}
		} catch (error) {
			console.log("An unexpected error occurred. Please try again.");
		}
	};

	const onSearchStory = async (query) => {
		try {
			const response = await axiosInstance.get("/search", {
				params: {
					query,
				},
			});

			if (response.data && response.data.stories) {
				setFilterType("search");
				setAllStories(response.data.stories);
			}
		} catch (error) {
			console.log("An unexpected error occurred. Please try again.");
		}
	};

	const handleClearSearch = () => {
		setFilterType("");
		getAllTravelStories();
	};

	const filterStoriesByDate = async (day) => {};

	const handleDayClick = () => {
		setDateRange(day);
		filterStoriesByDate(day);
	};

	useEffect(() => {
		getAllTravelStories();
		getUserInfo();

		return () => {};
	}, []);

	return (
		<>
			<Navbar
				userInfo={userInfo}
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				onSearchNote={onSearchStory}
				handleClearSearch={handleClearSearch}
			/>

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
							<EmptyCard
								imgSrc={EmptyImg}
								message={`Start creating your first Travel Story! Click the 'Add' button to jot down your thoughts, ideas, and memories.`}
							/>
						)}
						<div className="w-[340px]">
							<div className="bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg">
								<div className="p-3">
									<DayPicker
										captionLayout="dropdown-buttons"
										mode="range"
										selected={dateRange}
										onSelect={handleDayClick}
										pagedNavigation
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<Modal
				isOpen={openAddEditModal.isShown}
				onRequestClose={() => {}}
				style={{
					overlay: {
						backgroundColor: "rgba(0, 0, 0, 0.2)",
						zIndex: 999,
					},
				}}
				appElement={document.getElementById("root")}
				className="model-box"
			>
				<AddEditTravelStory
					type={openAddEditModal.type}
					storyInfo={openAddEditModal.data}
					onClose={() => {
						setOpenAddEditModal({ isShown: false, type: "add", data: null });
					}}
					getAllTravelStories={getAllTravelStories}
				/>
			</Modal>

			<Modal
				isOpen={openViewModal.isShown}
				onRequestClose={() => {}}
				style={{
					overlay: {
						backgroundColor: "rgba(0, 0, 0, 0.2)",
						zIndex: 999,
					},
				}}
				appElement={document.getElementById("root")}
				className="model-box"
			>
				<ViewTravelStory
					storyInfo={openViewModal.data || null}
					onClose={() => {
						setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
					}}
					onEditClick={() => {
						setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
						handleEdit(openViewModal.data || null);
					}}
					onDeleteClick={() => {
						deleteTravelStory(openViewModal.data || null);
					}}
				/>
			</Modal>

			<button
				className="w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-10 bottom-10"
				onClick={() => {
					setOpenAddEditModal({
						isShown: true,
						type: "add",
						data: null,
					});
				}}
			>
				<MdAdd className="text-[32px] text-white" />
			</button>

			<ToastContainer />
		</>
	);
};

export default Home;
