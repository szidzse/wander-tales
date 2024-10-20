import axiosInstance from "./axiosInstance";

export const uploadImage = async (imageFile) => {
	const formData = new FormData();

	formData.append("image", imageFile);

	try {
		const response = await axiosInstance.post("/upload-image", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error uploading image: ", error);
		throw error;
	}
};
