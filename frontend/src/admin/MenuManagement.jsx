import { useEffect, useState } from "react";
import axios from "axios";

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
        image: ""
    });

    const fetchItems = async () => {
        try {
            const token = localStorage.getItem("adminToken");

            const response = await axios.get(
                "http://localhost:5000/api/menu/admin/all",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setItems(response.data.items);

        } catch (error) {
            console.error(error);
            setError("Failed to load menu items.");
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/categories"
            );

            setCategories(response.data.categories);

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
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        try {
            const token = localStorage.getItem("adminToken");

            await axios.post(
                "http://localhost:5000/api/menu",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSuccess("Menu item added successfully!");

            setFormData({
                category_id: "",
                name: "",
                description: "",
                price: "",
                image: ""
            });

            setShowForm(false);

            await fetchItems();

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
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
            image: item.image || ""
        });

        setShowForm(true);
    };
    const handleUpdate = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        try {
            const token = localStorage.getItem("adminToken");

            await axios.put(
                `http://localhost:5000/api/menu/${editingItem.id}`,
                {
                    ...formData,
                    is_available: editingItem.is_available
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSuccess("Menu item updated successfully!");

            setEditingItem(null);

            setShowForm(false);

            setFormData({
                category_id: "",
                name: "",
                description: "",
                price: "",
                image: ""
            });

            await fetchItems();

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
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
                `http://localhost:5000/api/menu/${id}`,
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
                error.response?.data?.message ||
                "Failed to delete menu item."
            );
        }
    };
    const handleToggleAvailability = async (item) => {
        try {
            const token = localStorage.getItem("adminToken");

            await axios.put(
                `http://localhost:5000/api/menu/${item.id}`,
                {
                    category_id: item.category_id,
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    image: item.image,
                    is_available: !item.is_available
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSuccess(
                item.is_available
                    ? `${item.name} is now unavailable.`
                    : `${item.name} is now available.`
            );

            await fetchItems();

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to update availability."
            );
        }
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
                        className="btn btn-dark rounded-pill px-4"
                        onClick={() => setShowForm(true)}
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


                {/* ADD FORM */}

                {showForm && (
                    <div className="card border-0 shadow-sm mb-4">

                        <div className="card-body p-4">

                            <div className="d-flex justify-content-between align-items-center mb-4">

                                <h4 className="fw-bold mb-0">
                                    {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
                                </h4>

                                <button
                                    className="btn-close"
                                    onClick={() => setShowForm(false)}
                                ></button>

                            </div>

                            <form onSubmit={editingItem ? handleUpdate : handleSubmit}>

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
                                            Image Path
                                        </label>

                                        <input
                                            type="text"
                                            name="image"
                                            className="form-control"
                                            placeholder="/images/latte.jpg"
                                            value={formData.image}
                                            onChange={handleChange}
                                        />

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


                                    {/* BUTTONS */}

                                    <div className="col-12 d-flex gap-2">

                                        <button
                                            type="submit"
                                            className="btn btn-dark px-4"
                                        >
                                            {editingItem ? "Save Changes" : "Add Item"}
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => {
                                                setShowForm(false);
                                                setEditingItem(null);

                                                setFormData({
                                                    category_id: "",
                                                    name: "",
                                                    description: "",
                                                    price: "",
                                                    image: ""
                                                });
                                            }}
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

                        <div className="spinner-border"></div>

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

                                    {items.map((item) => (

                                        <tr key={item.id}>

                                            <td>

                                                <div className="d-flex align-items-center gap-3">

                                                    {item.image ? (

                                                        <img
                                                            src={`http://localhost:5000${item.image}`}
                                                            alt={item.name}
                                                            className="admin-menu-image"
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
                                                        checked={Boolean(item.is_available)}
                                                        onChange={() =>
                                                            handleToggleAvailability(item)
                                                        }
                                                    />

                                                    <label className="form-check-label">
                                                        {item.is_available ? (
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
                                                        className="btn btn-sm btn-outline-dark"
                                                        title="Edit"
                                                        onClick={() => handleEdit(item)}
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </button>

                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        title="Delete"
                                                        onClick={() => handleDelete(item.id)}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    ))}

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