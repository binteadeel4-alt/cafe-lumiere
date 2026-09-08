
import { useEffect, useState } from "react";
import axios from "axios";

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

    const getToken = () => {
        return localStorage.getItem("adminToken");
    };



    // ==========================================
    // FETCH GALLERY
    // ==========================================

    const fetchGallery = async () => {

        try {

            const token = getToken();

            const response = await axios.get(
                "https://cafe-lumiere-production.up.railway.app/api/gallery/admin/all",
                {
                    headers: {
                        Authorization: `Bearer ${token} `
                    }
                }
            );

            setItems(response.data.items || []);

        } catch (error) {

            console.error("FETCH GALLERY ERROR:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load gallery."
            );

        } finally {

            setLoading(false);

        }
    };

    const handleFileChange = (e) => {

        const file = e.target.files[0];

        if (!file) {
            return;
        }

        setFormData((current) => ({
            ...current,
            file
        }));

    };



    useEffect(() => {
        fetchGallery();
    }, []);


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
    // RESET
    // ==========================================

    const resetForm = () => {

        setFormData({
            title: "",
            media_type: "image",
            file: null,
            description: ""
        });

        setEditingId(null);

    };

    // ==========================================
    // SUBMIT
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        try {

            const token = getToken();

            const data = new FormData();

            data.append("title", formData.title);
            data.append("description", formData.description);

            if (formData.file) {
                data.append("file", formData.file);
            }

            if (editingId) {

                // Keep your existing update system
                await axios.put(
                    `https://cafe-lumiere-production.up.railway.app/api/gallery/${editingId}`,
                    {
                        title: formData.title,
                        description: formData.description
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setSuccess(
                    "Gallery item updated successfully."
                );

            } else {

                await axios.post(
                    "https://cafe-lumiere-production.up.railway.app/api/gallery",
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
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

            setError(
                error.response?.data?.message ||
                "Failed to save gallery item."
            );

        }

    };


    // ==========================================
    // EDIT
    // ==========================================

    const handleEdit = (item) => {

        setEditingId(item.id);

        setFormData({
            title: item.title || "",
            media_type: item.video ? "video" : "image",
            image: item.image || "",
            video: item.video || "",
            description: item.description || ""
        });

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

            const token = getToken();

            await axios.delete(
                `https://cafe-lumiere-production.up.railway.app/api/gallery/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSuccess("Gallery item deleted successfully.");

            await fetchGallery();

        } catch (error) {

            console.error("DELETE GALLERY ERROR:", error);

            setError(
                error.response?.data?.message ||
                "Failed to delete gallery item."
            );

        }

    };


    // ==========================================
    // TOGGLE ACTIVE
    // ==========================================

    const toggleActive = async (item) => {

        try {

            const token = getToken();

            await axios.put(
                `https://cafe-lumiere-production.up.railway.app/api/gallery/${item.id}`,
                {
                    title: item.title,
                    image: item.image || "",
                    video: item.video || "",
                    description: item.description || "",
                    is_active:
                        Number(item.is_active) === 1
                            ? 0
                            : 1
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            await fetchGallery();

        } catch (error) {

            console.error("TOGGLE GALLERY ERROR:", error);

            setError(
                error.response?.data?.message ||
                "Failed to update gallery status."
            );

        }

    };


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
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="alert alert-success">
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

                                <label className="form-label fw-semibold">
                                    Title
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    className="form-control"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Café Interior"
                                    required
                                />

                            </div>


                            {/* MEDIA FILE */}

                            <div className="mb-3">

                                <label className="form-label fw-semibold">
                                    {formData.media_type === "image"
                                        ? "Choose Image"
                                        : "Choose Video"}
                                </label>

                                <input
                                    type="file"
                                    className="form-control"
                                    accept={
                                        formData.media_type === "image"
                                            ? "image/jpeg,image/png,image/webp"
                                            : "video/mp4,video/webm,video/quicktime"
                                    }
                                    onChange={handleFileChange}
                                    required={!editingId}
                                />

                                <small className="text-muted">
                                    {formData.media_type === "image"
                                        ? "JPG, PNG or WEBP"
                                        : "MP4, WEBM or MOV"}
                                </small>

                            </div>





                            {/* DESCRIPTION */}

                            <div className="mb-4">

                                <label className="form-label fw-semibold">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    className="form-control"
                                    rows="3"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe this photo or video..."
                                />

                            </div>


                            {/* BUTTONS */}

                            <div className="d-flex gap-2">

                                <button
                                    type="submit"
                                    className="btn btn-dark rounded-pill px-4"
                                >

                                    <i className="bi bi-plus-lg me-2"></i>

                                    {editingId
                                        ? "Update"
                                        : "Add Gallery Item"}

                                </button>


                                {editingId && (

                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary rounded-pill px-4"
                                        onClick={resetForm}
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


                {loading ? (

                    <div className="text-center py-5">
                        <div className="spinner-border"></div>
                    </div>

                ) : items.length === 0 ? (

                    <div className="card border-0 shadow-sm">

                        <div className="card-body text-center py-5">

                            <i className="bi bi-images fs-1"></i>

                            <h4 className="fw-bold mt-3">
                                No gallery items
                            </h4>

                            <p className="text-muted mb-0">
                                Add your first café photo or video above.
                            </p>

                        </div>

                    </div>

                ) : (

                    <div className="row g-4">

                        {items.map((item) => {

                            const active =
                                Number(item.is_active) === 1;

                            return (

                                <div
                                    className="col-md-6 col-lg-4"
                                    key={item.id}
                                >

                                    <div className="card border-0 shadow-sm h-100 overflow-hidden">

                                        {/* MEDIA */}

                                        {item.image && (

                                            <img
                                                src={`https://cafe-lumiere-production.up.railway.app${item.image}`}
                                                alt={item.title}
                                                className="w-100"
                                                style={{
                                                    height: "220px",
                                                    objectFit: "cover"
                                                }}
                                            />

                                        )}

                                        {item.video && (

                                            <video
                                                src={`https://cafe-lumiere-production.up.railway.app${item.video}`}
                                                className="w-100"
                                                style={{
                                                    height: "220px",
                                                    objectFit: "cover"
                                                }}
                                                controls
                                            />

                                        )}


                                        <div className="card-body p-4">

                                            <div className="d-flex justify-content-between align-items-start gap-2">

                                                <div>

                                                    <h5 className="fw-bold mb-2">
                                                        {item.title}
                                                    </h5>

                                                    <span className="badge text-bg-secondary">
                                                        {item.video
                                                            ? "Video"
                                                            : "Image"}
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


                                            <div className="d-flex gap-2 mt-3">

                                                <button
                                                    className="btn btn-sm btn-outline-dark"
                                                    onClick={() =>
                                                        handleEdit(item)
                                                    }
                                                >
                                                    <i className="bi bi-pencil me-1"></i>
                                                    Edit
                                                </button>


                                                <button
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
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() =>
                                                        handleDelete(item.id)
                                                    }
                                                >
                                                    <i className="bi bi-trash"></i>
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

