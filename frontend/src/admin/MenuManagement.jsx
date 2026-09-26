import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

function MenuManagement() {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const [formData, setFormData] = useState({
        category_id: "",
        name: "",
        description: "",
        price: "",
        image: null,
        is_featured: false
    });

    const resetForm = () => {
        setFormData({
            category_id: "",
            name: "",
            description: "",
            price: "",
            image: null,
            is_featured: false
        });

        setEditingItem(null);
        setShowForm(false);
    };

    const fetchItems = async () => {
        try {
            const token = localStorage.getItem("adminToken");

            const response = await axios.get(
                `${API_URL}/api/menu/admin/all`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const menuItems = response.data?.items || [];

            const normalizedItems = menuItems.map((item) => ({
                ...item,
                is_available: Number(item.is_available) === 1,
                is_featured: Number(item.is_featured) === 1
            }));

            setItems(normalizedItems);

        } catch (error) {
            console.error(error);

            setError(
                error.response?.status === 401
                    ? "Your admin session has expired. Please log in again."
                    : "Failed to load menu items."
            );
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get(
                `${API_URL}/api/categories`
            );

            setCategories(response.data?.categories || []);

        } catch (error) {
            console.error(error);
            setError("Failed to load categories.");
        }
    };

    useEffect(() => {
        const loadData = async () => {
            await Promise.all([
                fetchItems(),
                fetchCategories()
            ]);

            setLoading(false);
        };

        loadData();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]:
                type === "checkbox"
                    ? checked
                    : type === "file"
                        ? files[0] || null
                        : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        try {
            const token = localStorage.getItem("adminToken");

            const data = new FormData();

            data.append("category_id", formData.category_id);
            data.append("name", formData.name);
            data.append("description", formData.description);
            data.append("price", formData.price);
            data.append(
                "is_featured",
                formData.is_featured ? 1 : 0
            );

            if (formData.image) {
                data.append("image", formData.image);
            }

            await axios.post(
                `${API_URL}/api/menu`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSuccess("Menu item added successfully!");

            resetForm();

            await fetchItems();

        } catch (error) {
            console.error(error);

            setError(
                error.response?.status === 401
                    ? "Your admin session has expired. Please log in again."
                    : error.response?.data?.message ||
                    "Failed to add menu item."
            );
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);

        setFormData({
            category_id: item.category_id,
            name: item.name,
            description: item.description || "",
            price: item.price,
            image: null,
            is_featured: Number(item.is_featured) === 1
        });

        setShowForm(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        try {
            const token = localStorage.getItem("adminToken");

            const data = new FormData();

            data.append("category_id", formData.category_id);
            data.append("name", formData.name);
            data.append("description", formData.description);
            data.append("price", formData.price);
            data.append(
                "is_available",
                editingItem.is_available ? 1 : 0
            );
            data.append(
                "is_featured",
                formData.is_featured ? 1 : 0
            );

            if (formData.image) {
                data.append("image", formData.image);
            }

            await axios.put(
                `${API_URL}/api/menu/${editingItem.id}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSuccess("Menu item updated successfully!");

            resetForm();

            await fetchItems();

        } catch (error) {
            console.error(error);

            setError(
                error.response?.status === 401
                    ? "Your admin session has expired. Please log in again."
                    : error.response?.data?.message ||
                    "Failed to update menu item."
            );
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this menu item?"
        );

        if (!confirmed) {
            return;
        }

        setError("");
        setSuccess("");

        try {
            const token = localStorage.getItem("adminToken");

            await axios.delete(
                `${API_URL}/api/menu/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSuccess("Menu item deleted successfully!");

            await fetchItems();

        } catch (error) {
            console.error(error);

            setError(
                error.response?.status === 401
                    ? "Your admin session has expired. Please log in again."
                    : error.response?.data?.message ||
                    "Failed to delete menu item."
            );
        }
    };

    const handleToggleAvailability = async (item) => {
        setError("");
        setSuccess("");

        const currentAvailability =
            Number(item.is_available) === 1 ||
            item.is_available === true;

        const newAvailability = !currentAvailability;

        try {
            const token = localStorage.getItem("adminToken");

            const data = new FormData();

            data.append("category_id", item.category_id);
            data.append("name", item.name);
            data.append("description", item.description || "");
            data.append("price", item.price);
            data.append(
                "is_available",
                newAvailability ? 1 : 0
            );
            data.append(
                "is_featured",
                Number(item.is_featured) === 1 ||
                    item.is_featured === true
                    ? 1
                    : 0
            );

            await axios.put(
                `${API_URL}/api/menu/${item.id}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSuccess(
                newAvailability
                    ? `${item.name} is now available.`
                    : `${item.name} is now unavailable.`
            );

            await fetchItems();

        } catch (error) {
            console.error(error);

            setError(
                error.response?.status === 401
                    ? "Your admin session has expired. Please log in again."
                    : error.response?.data?.message ||
                    "Failed to update availability."
            );
        }
    };

    const getImageUrl = (image) => {
        if (!image) {
            return "";
        }

        if (
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {
            return image;
        }

        return `${API_URL}${image}`;
    };

    return (
        <div className="admin-dashboard">

            <div className="container py-5">

                {/* HEADER */}

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <div>
                        <h1 className="fw-bold mb-1">
                            Menu Management
                        </h1>

                        <p className="text-muted mb-0">
                            Manage your café menu.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="btn btn-dark rounded-pill px-4"
                        onClick={() => {
                            setEditingItem(null);
                            setFormData({
                                category_id: "",
                                name: "",
                                description: "",
                                price: "",
                                image: null,
                                is_featured: false
                            });
                            setShowForm(true);
                        }}
                    >
                        <i className="bi bi-plus-lg me-2"></i>
                        Add Item
                    </button>

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


                {/* ADD / EDIT FORM */}

                {showForm && (
                    <div className="card border-0 shadow-sm mb-4">

                        <div className="card-body p-4">

                            <div className="d-flex justify-content-between align-items-center mb-4">

                                <h4 className="fw-bold mb-0">
                                    {editingItem
                                        ? "Edit Menu Item"
                                        : "Add New Menu Item"}
                                </h4>

                                <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Close"
                                    onClick={resetForm}
                                ></button>

                            </div>

                            <form
                                onSubmit={
                                    editingItem
                                        ? handleUpdate
                                        : handleSubmit
                                }
                            >

                                <div className="row g-3">

                                    {/* NAME */}

                                    <div className="col-md-6">

                                        <label className="form-label">
                                            Item Name
                                        </label>

                                        <input
                                            type="text"
                                            name="name"
                                            className="form-control"
                                            placeholder="e.g. Caramel Latte"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />

                                    </div>


                                    {/* CATEGORY */}

                                    <div className="col-md-6">

                                        <label className="form-label">
                                            Category
                                        </label>

                                        <select
                                            name="category_id"
                                            className="form-select"
                                            value={formData.category_id}
                                            onChange={handleChange}
                                            required
                                        >

                                            <option value="">
                                                Select category
                                            </option>

                                            {categories.map((category) => (
                                                <option
                                                    key={category.id}
                                                    value={category.id}
                                                >
                                                    {category.name}
                                                </option>
                                            ))}

                                        </select>

                                    </div>


                                    {/* PRICE */}

                                    <div className="col-md-6">

                                        <label className="form-label">
                                            Price (KWD)
                                        </label>

                                        <input
                                            type="number"
                                            name="price"
                                            className="form-control"
                                            placeholder="2.500"
                                            step="0.001"
                                            min="0"
                                            value={formData.price}
                                            onChange={handleChange}
                                            required
                                        />

                                    </div>


                                    {/* IMAGE */}

                                    <div className="col-md-6">

                                        <label className="form-label">
                                            Image
                                        </label>

                                        <input
                                            type="file"
                                            name="image"
                                            className="form-control"
                                            accept="image/jpeg,image/png,image/webp,image/jpg"
                                            onChange={handleChange}
                                        />

                                        {editingItem && editingItem.image && (
                                            <small className="text-muted d-block mt-2">
                                                Leave empty to keep the current image.
                                            </small>
                                        )}

                                    </div>


                                    {/* DESCRIPTION */}

                                    <div className="col-12">

                                        <label className="form-label">
                                            Description
                                        </label>

                                        <textarea
                                            name="description"
                                            className="form-control"
                                            rows="3"
                                            placeholder="Describe the item..."
                                            value={formData.description}
                                            onChange={handleChange}
                                        ></textarea>

                                    </div>


                                    {/* FEATURED */}

                                    <div className="col-12">

                                        <div className="form-check form-switch">

                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                role="switch"
                                                id="isFeatured"
                                                name="is_featured"
                                                checked={formData.is_featured}
                                                onChange={handleChange}
                                            />

                                            <label
                                                className="form-check-label fw-semibold"
                                                htmlFor="isFeatured"
                                            >
                                                Show on Homepage as Featured
                                            </label>

                                        </div>

                                        <small className="text-muted">
                                            Featured items appear in the
                                            "Our favorites" section on the
                                            homepage.
                                        </small>

                                    </div>


                                    {/* BUTTONS */}

                                    <div className="col-12 d-flex gap-2">

                                        <button
                                            type="submit"
                                            className="btn btn-dark px-4"
                                        >
                                            {editingItem
                                                ? "Save Changes"
                                                : "Add Item"}
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={resetForm}
                                        >
                                            Cancel
                                        </button>

                                    </div>

                                </div>

                            </form>

                        </div>

                    </div>
                )}


                {/* MENU TABLE */}

                {loading ? (

                    <div className="text-center py-5">

                        <div
                            className="spinner-border"
                            role="status"
                            aria-label="Loading menu items"
                        >
                            <span className="visually-hidden">
                                Loading...
                            </span>
                        </div>

                    </div>

                ) : (

                    <div className="card border-0 shadow-sm">

                        <div className="table-responsive">

                            <table className="table align-middle mb-0">

                                <thead>

                                    <tr>
                                        <th>Item</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {items.length === 0 ? (

                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="text-center text-muted py-5"
                                            >
                                                No menu items found.
                                            </td>
                                        </tr>

                                    ) : (

                                        items.map((item) => {

                                            const isAvailable =
                                                Number(item.is_available) === 1 ||
                                                item.is_available === true;

                                            const isFeatured =
                                                Number(item.is_featured) === 1 ||
                                                item.is_featured === true;

                                            return (
                                                <tr key={item.id}>

                                                    <td>

                                                        <div className="d-flex align-items-center gap-3">

                                                            {item.image ? (

                                                                <img
                                                                    src={getImageUrl(item.image)}
                                                                    alt={item.name}
                                                                    className="admin-menu-image"
                                                                    loading="lazy"
                                                                    onError={(event) => {
                                                                        event.currentTarget.style.display =
                                                                            "none";
                                                                    }}
                                                                />

                                                            ) : (

                                                                <div className="admin-menu-placeholder">

                                                                    <i className="bi bi-cup-hot"></i>

                                                                </div>

                                                            )}

                                                            <div>

                                                                <strong>
                                                                    {item.name}
                                                                </strong>

                                                                {isFeatured && (
                                                                    <span className="badge bg-dark ms-2">
                                                                        Featured
                                                                    </span>
                                                                )}

                                                                <small className="d-block text-muted">
                                                                    {item.description}
                                                                </small>

                                                            </div>

                                                        </div>

                                                    </td>

                                                    <td>
                                                        {item.category}
                                                    </td>

                                                    <td>
                                                        KD {item.price}
                                                    </td>

                                                    <td>

                                                        <div className="form-check form-switch">

                                                            <input
                                                                className="form-check-input availability-switch"
                                                                type="checkbox"
                                                                role="switch"
                                                                checked={isAvailable}
                                                                onChange={() =>
                                                                    handleToggleAvailability(item)
                                                                }
                                                                aria-label={`Toggle availability for ${item.name}`}
                                                            />

                                                            <label className="form-check-label">

                                                                {isAvailable ? (
                                                                    <span className="text-success fw-semibold">
                                                                        Available
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-secondary fw-semibold">
                                                                        Unavailable
                                                                    </span>
                                                                )}

                                                            </label>

                                                        </div>

                                                    </td>

                                                    <td>

                                                        <div className="d-flex gap-2">

                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-dark"
                                                                title="Edit"
                                                                aria-label={`Edit ${item.name}`}
                                                                onClick={() =>
                                                                    handleEdit(item)
                                                                }
                                                            >
                                                                <i className="bi bi-pencil"></i>
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-danger"
                                                                title="Delete"
                                                                aria-label={`Delete ${item.name}`}
                                                                onClick={() =>
                                                                    handleDelete(item.id)
                                                                }
                                                            >
                                                                <i className="bi bi-trash"></i>
                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>
                                            );
                                        })

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                )}

            </div>

        </div>
    );
}

export default MenuManagement;

