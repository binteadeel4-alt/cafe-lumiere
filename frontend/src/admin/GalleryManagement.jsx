import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

function GalleryManagement() {

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        title: "",
        media_type: "image",
        file: null,
        description: ""
    });

    const [editingId, setEditingId] = useState(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [saving, setSaving] = useState(false);

    const fileInputRef = useRef(null);

    const getToken = () => {
        return localStorage.getItem("adminToken");
    };

    // ==========================================
    // FETCH GALLERY
    // ==========================================

    const fetchGallery = async () => {

        try {

            setError("");

            const token = getToken();

            const response = await axios.get(
                `${API_URL}/api/gallery/admin/all`,
                {
                    headers: {
                        Authorization: `Bearer ${token} `
                    }
                }
            );

            setItems(response.data.items || []);

        } catch (error) {

            console.error("FETCH GALLERY ERROR:", error);

            if (error.response?.status === 401) {
                setError(
                    "Your admin session has expired. Please log in again."
                );
            } else {
                setError(
                    error.response?.data?.message ||
                    "Failed to load gallery."
                );
            }

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // FILE VALIDATION
    // ==========================================

    const validateFile = (file, mediaType) => {

        if (!file) {
            return "Please select a file.";
        }

        const maxSize = 100 * 1024 * 1024;

        if (file.size > maxSize) {
            return "File size must be 100 MB or smaller.";
        }

        const allowedImages = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"
        ];

        const allowedVideos = [
            "video/mp4",
            "video/webm",
            "video/quicktime"
        ];

        if (
            mediaType === "image" &&
            !allowedImages.includes(file.type)
        ) {
            return "Please select a JPG, PNG or WEBP image.";
        }

        if (
            mediaType === "video" &&
            !allowedVideos.includes(file.type)
        ) {
            return "Please select an MP4, WEBM or MOV video.";
        }

        return "";

    };


    // ==========================================
    // FILE CHANGE
    // ==========================================

    const handleFileChange = (e) => {

        const file = e.target.files[0];

        if (!file) {
            setFormData((current) => ({
                ...current,
                file: null
            }));
            return;
        }

        const fileError = validateFile(
            file,
            formData.media_type
        );

        if (fileError) {

            setError(fileError);

            e.target.value = "";

            setFormData((current) => ({
                ...current,
                file: null
            }));

            return;
        }

        setError("");

        setFormData((current) => ({
            ...current,
            file
        }));

    };


    // ==========================================
    // MEDIA TYPE CHANGE
    // ==========================================

    const handleMediaTypeChange = (e) => {

        const mediaType = e.target.value;

        setFormData((current) => ({
            ...current,
            media_type: mediaType,
            file: null
        }));

        setError("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

    };


    // ==========================================
    // FORM CHANGE
    // ==========================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((current) => ({
            ...current,
            [name]: value
        }));

    };


    // ==========================================
    // RESET FORM
    // ==========================================

    const resetForm = () => {

        setFormData({
            title: "",
            media_type: "image",
            file: null,
            description: ""
        });

        setEditingId(null);
        setError("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

    };


    // ==========================================
    // SUBMIT
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        if (!formData.title.trim()) {
            setError("Title is required.");
            return;
        }

        // New item requires a file.
        if (!editingId && !formData.file) {
            setError("Please select an image or video.");
            return;
        }

        // If a new file was selected while editing,
        // validate it before sending.
        if (formData.file) {

            const fileError = validateFile(
                formData.file,
                formData.media_type
            );

            if (fileError) {
                setError(fileError);
                return;
            }

        }

        try {

            setSaving(true);

            const token = getToken();

            if (editingId) {

                const data = new FormData();

                data.append(
                    "title",
                    formData.title.trim()
                );

                data.append(
                    "description",
                    formData.description.trim()
                );

                data.append(
                    "is_active",
                    "1"
                );

                if (formData.file) {
                    data.append(
                        "file",
                        formData.file
                    );
                }

                await axios.put(
                    `${API_URL}/api/gallery/${editingId}`,
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${token} `
                        }
                    }
                );

                setSuccess(
                    "Gallery item updated successfully."
                );

            } else {

                const data = new FormData();

                data.append(
                    "title",
                    formData.title.trim()
                );

                data.append(
                    "description",
                    formData.description.trim()
                );

                data.append(
                    "file",
                    formData.file
                );

                await axios.post(
                    `${API_URL}/api/gallery`,
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${token} `
                        }
                    }
                );

                setSuccess(
                    "Gallery item added successfully."
                );

            }

            resetForm();

            await fetchGallery();

        } catch (error) {

            console.error(
                "SAVE GALLERY ERROR:",
                error
            );

            if (error.response?.status === 401) {

                setError(
                    "Your admin session has expired. Please log in again."
                );

            } else {

                setError(
                    error.response?.data?.message ||
                    "Failed to save gallery item."
                );

            }

        } finally {

            setSaving(false);

        }

    };


    // ==========================================
    // EDIT
    // ==========================================

    const handleEdit = (item) => {

        setEditingId(item.id);

        setFormData({
            title: item.title || "",
            media_type: item.video
                ? "video"
                : "image",
            file: null,
            description: item.description || ""
        });

        setError("");
        setSuccess("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    // ==========================================
    // DELETE
    // ==========================================

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this gallery item?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setError("");
            setSuccess("");

            const token = getToken();

            await axios.delete(
                `${API_URL}/api/gallery/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token} `
                    }
                }
            );

            setSuccess(
                "Gallery item deleted successfully."
            );

            if (editingId === id) {
                resetForm();
            }

            await fetchGallery();

        } catch (error) {

            console.error(
                "DELETE GALLERY ERROR:",
                error
            );

            if (error.response?.status === 401) {

                setError(
                    "Your admin session has expired. Please log in again."
                );

            } else {

                setError(
                    error.response?.data?.message ||
                    "Failed to delete gallery item."
                );

            }

        }

    };


    // ==========================================
    // TOGGLE ACTIVE
    // ==========================================

    const toggleActive = async (item) => {

        try {

            setError("");
            setSuccess("");

            const token = getToken();

            await axios.put(
                `${API_URL}/api/gallery/${item.id}`,
                {
                    title: item.title,
                    description: item.description || "",
                    is_active:
                        Number(item.is_active) === 1
                            ? 0
                            : 1
                },
                {
                    headers: {
                        Authorization: `Bearer ${token} `
                    }
                }
            );

            await fetchGallery();

        } catch (error) {

            console.error(
                "TOGGLE GALLERY ERROR:",
                error
            );

            if (error.response?.status === 401) {

                setError(
                    "Your admin session has expired. Please log in again."
                );

            } else {

                setError(
                    error.response?.data?.message ||
                    "Failed to update gallery status."
                );

            }

        }

    };


    // ==========================================
    // LOAD
    // ==========================================

    useEffect(() => {
        fetchGallery();
    }, []);


    return (
        <div className="admin-dashboard">

            <div className="container py-5">

                {/* HEADER */}

                <div className="mb-5">

                    <h1 className="fw-bold mb-1">
                        Gallery Management
                    </h1>

                    <p className="text-muted mb-0">
                        Add and manage café photos and videos.
                    </p>

                </div>


                {/* ALERTS */}

                {error && (
                    <div
                        className="alert alert-danger"
                        role="alert"
                    >
                        {error}
                    </div>
                )}

                {success && (
                    <div
                        className="alert alert-success"
                        role="alert"
                    >
                        {success}
                    </div>
                )}


                {/* FORM */}

                <div className="card border-0 shadow-sm mb-5">

                    <div className="card-body p-4">

                        <h4 className="fw-bold mb-4">

                            {editingId
                                ? "Edit Gallery Item"
                                : "Add Gallery Item"}

                        </h4>


                        <form onSubmit={handleSubmit}>

                            {/* TITLE */}

                            <div className="mb-3">

                                <label
                                    htmlFor="gallery-title"
                                    className="form-label fw-semibold"
                                >
                                    Title
                                </label>

                                <input
                                    id="gallery-title"
                                    type="text"
                                    name="title"
                                    className="form-control"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Café Interior"
                                    maxLength="150"
                                    required
                                />

                            </div>


                            {/* MEDIA TYPE */}

                            <div className="mb-3">

                                <label
                                    htmlFor="gallery-media-type"
                                    className="form-label fw-semibold"
                                >
                                    Media Type
                                </label>

                                <select
                                    id="gallery-media-type"
                                    className="form-select"
                                    value={formData.media_type}
                                    onChange={handleMediaTypeChange}
                                >
                                    <option value="image">
                                        Image
                                    </option>

                                    <option value="video">
                                        Video
                                    </option>
                                </select>

                            </div>


                            {/* MEDIA FILE */}

                            <div className="mb-3">

                                <label
                                    htmlFor="gallery-file"
                                    className="form-label fw-semibold"
                                >
                                    {editingId
                                        ? "Replace Media (Optional)"
                                        : formData.media_type === "image"
                                            ? "Choose Image"
                                            : "Choose Video"}
                                </label>

                                <input
                                    ref={fileInputRef}
                                    id="gallery-file"
                                    type="file"
                                    className="form-control"
                                    accept={
                                        formData.media_type === "image"
                                            ? "image/jpeg,image/jpg,image/png,image/webp"
                                            : "video/mp4,video/webm,video/quicktime"
                                    }
                                    onChange={handleFileChange}
                                    required={!editingId}
                                />

                                <small className="text-muted">

                                    {formData.media_type === "image"
                                        ? "JPG, PNG or WEBP — maximum 100 MB"
                                        : "MP4, WEBM or MOV — maximum 100 MB"}

                                </small>

                                {formData.file && (
                                    <div className="small text-success mt-2">
                                        Selected: {formData.file.name}
                                    </div>
                                )}

                                {editingId && !formData.file && (
                                    <div className="small text-muted mt-2">
                                        Leave empty to keep the current media.
                                    </div>
                                )}

                            </div>


                            {/* DESCRIPTION */}

                            <div className="mb-4">

                                <label
                                    htmlFor="gallery-description"
                                    className="form-label fw-semibold"
                                >
                                    Description
                                </label>

                                <textarea
                                    id="gallery-description"
                                    name="description"
                                    className="form-control"
                                    rows="3"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe this photo or video..."
                                    maxLength="1000"
                                />

                            </div>


                            {/* BUTTONS */}

                            <div className="d-flex gap-2">

                                <button
                                    type="submit"
                                    className="btn btn-dark rounded-pill px-4"
                                    disabled={saving}
                                >

                                    {saving ? (
                                        <>
                                            <span
                                                className="spinner-border spinner-border-sm me-2"
                                                aria-hidden="true"
                                            ></span>

                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <i
                                                className={
                                                    editingId
                                                        ? "bi bi-check-lg me-2"
                                                        : "bi bi-plus-lg me-2"
                                                }
                                                aria-hidden="true"
                                            ></i>

                                            {editingId
                                                ? "Update"
                                                : "Add Gallery Item"}
                                        </>
                                    )}

                                </button>


                                {editingId && (
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary rounded-pill px-4"
                                        onClick={resetForm}
                                        disabled={saving}
                                    >
                                        Cancel
                                    </button>
                                )}

                            </div>

                        </form>

                    </div>

                </div>


                {/* GALLERY LIST */}

                <div className="d-flex justify-content-between align-items-center mb-3">

                    <h4 className="fw-bold mb-0">
                        Gallery Items
                    </h4>

                    <span className="badge text-bg-dark">
                        {items.length} Items
                    </span>

                </div>


                {/* LOADING */}

                {loading ? (

                    <div
                        className="text-center py-5"
                        aria-live="polite"
                    >

                        <div
                            className="spinner-border"
                            role="status"
                        >
                            <span className="visually-hidden">
                                Loading gallery...
                            </span>
                        </div>

                    </div>

                ) : items.length === 0 ? (

                    /* EMPTY */

                    <div className="card border-0 shadow-sm">

                        <div className="card-body text-center py-5">

                            <i
                                className="bi bi-images fs-1"
                                aria-hidden="true"
                            ></i>

                            <h4 className="fw-bold mt-3">
                                No gallery items
                            </h4>

                            <p className="text-muted mb-0">
                                Add your first café photo or video above.
                            </p>

                        </div>

                    </div>

                ) : (

                    /* ITEMS */

                    <div className="row g-4">

                        {items.map((item) => {

                            const active =
                                Number(item.is_active) === 1;

                            const mediaUrl = item.image
                                ? `${API_URL}${item.image}`
                                : item.video
                                    ? `${API_URL}${item.video}`
                                    : "";

                            return (

                                <div
                                    className="col-md-6 col-lg-4"
                                    key={item.id}
                                >

                                    <div className="card border-0 shadow-sm h-100 overflow-hidden">


                                        {/* MEDIA */}

                                        {item.image ? (

                                            <img
                                                src={mediaUrl}
                                                alt={item.title || "Gallery image"}
                                                className="w-100"
                                                loading="lazy"
                                                style={{
                                                    height: "220px",
                                                    objectFit: "cover"
                                                }}
                                                onError={(e) => {
                                                    e.currentTarget.style.display = "none";
                                                }}
                                            />

                                        ) : item.video ? (

                                            <video
                                                src={mediaUrl}
                                                className="w-100"
                                                style={{
                                                    height: "220px",
                                                    objectFit: "cover"
                                                }}
                                                controls
                                                preload="metadata"
                                                aria-label={
                                                    item.title ||
                                                    "Gallery video"
                                                }
                                            />

                                        ) : (

                                            <div
                                                className="d-flex align-items-center justify-content-center bg-light"
                                                style={{
                                                    height: "220px"
                                                }}
                                            >
                                                <div className="text-center text-muted">
                                                    <i
                                                        className="bi bi-image fs-1"
                                                        aria-hidden="true"
                                                    ></i>

                                                    <div className="mt-2">
                                                        No media
                                                    </div>
                                                </div>
                                            </div>

                                        )}


                                        {/* CARD BODY */}

                                        <div className="card-body p-4">

                                            <div className="d-flex justify-content-between align-items-start gap-2">

                                                <div>

                                                    <h5 className="fw-bold mb-2">
                                                        {item.title}
                                                    </h5>

                                                    <span className="badge text-bg-secondary">

                                                        {item.video
                                                            ? "Video"
                                                            : item.image
                                                                ? "Image"
                                                                : "No Media"}

                                                    </span>

                                                </div>


                                                <span
                                                    className={
                                                        active
                                                            ? "badge text-bg-success"
                                                            : "badge text-bg-secondary"
                                                    }
                                                >
                                                    {active
                                                        ? "Active"
                                                        : "Hidden"}
                                                </span>

                                            </div>


                                            {item.description && (

                                                <p className="text-muted mt-3 mb-0">
                                                    {item.description}
                                                </p>

                                            )}


                                            {/* ACTIONS */}

                                            <div className="d-flex gap-2 mt-3 flex-wrap">

                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-dark"
                                                    onClick={() =>
                                                        handleEdit(item)
                                                    }
                                                >
                                                    <i
                                                        className="bi bi-pencil me-1"
                                                        aria-hidden="true"
                                                    ></i>

                                                    Edit
                                                </button>


                                                <button
                                                    type="button"
                                                    className={
                                                        active
                                                            ? "btn btn-sm btn-outline-warning"
                                                            : "btn btn-sm btn-outline-success"
                                                    }
                                                    onClick={() =>
                                                        toggleActive(item)
                                                    }
                                                >

                                                    {active
                                                        ? "Hide"
                                                        : "Show"}

                                                </button>


                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() =>
                                                        handleDelete(item.id)
                                                    }
                                                    aria-label={
                                                        `Delete ${item.title || "gallery item"} `
                                                    }
                                                >

                                                    <i
                                                        className="bi bi-trash"
                                                        aria-hidden="true"
                                                    ></i>

                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            );

                        })}

                    </div>

                )}

            </div>

        </div>
    );

}

export default GalleryManagement;

