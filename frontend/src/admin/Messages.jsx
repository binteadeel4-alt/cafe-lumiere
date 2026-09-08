import { useEffect, useState } from "react";
import axios from "axios";

function Messages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem("adminToken");

            const response = await axios.get(
                "https://cafe-lumiere-production.up.railway.app/api/messages",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessages(response.data.messages);

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load messages."
            );

        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchMessages();
    }, []);


    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem("adminToken");

            await axios.put(
                `https://cafe-lumiere-production.up.railway.app/api/messages/${id}/read`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSuccess("Message marked as read.");

            setMessages((currentMessages) =>
                currentMessages.map((message) =>
                    message.id === id
                        ? {
                            ...message,
                            is_read: 1
                        }
                        : message
                )
            );

            setTimeout(() => {
                setSuccess("");
            }, 3000);

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to mark message as read."
            );
        }
    };


    const deleteMessage = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this message?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const token = localStorage.getItem("adminToken");

            await axios.delete(
                `https://cafe-lumiere-production.up.railway.app/api/messages/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessages((currentMessages) =>
                currentMessages.filter(
                    (message) => message.id !== id
                )
            );

            setSuccess("Message deleted successfully.");

            setTimeout(() => {
                setSuccess("");
            }, 3000);

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to delete message."
            );
        }
    };


    const unreadCount = messages.filter(
        (message) => Number(message.is_read) === 0
    ).length;


    return (
        <div className="admin-dashboard">

            <div className="container py-5">

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <div>
                        <h1 className="fw-bold mb-1">
                            Messages
                        </h1>

                        <p className="text-muted mb-0">
                            Manage customer messages.
                        </p>
                    </div>

                    <span className="badge text-bg-warning fs-6">
                        {unreadCount} Unread
                    </span>

                </div>


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


                {loading ? (

                    <div className="text-center py-5">
                        <div className="spinner-border"></div>
                    </div>

                ) : messages.length === 0 ? (

                    <div className="card border-0 shadow-sm">

                        <div className="card-body text-center py-5">

                            <i className="bi bi-envelope-open fs-1"></i>

                            <h4 className="mt-3">
                                No messages
                            </h4>

                            <p className="text-muted mb-0">
                                Customer messages will appear here.
                            </p>

                        </div>

                    </div>

                ) : (

                    <div className="row g-4">

                        {messages.map((message) => (

                            <div
                                className="col-12"
                                key={message.id}
                            >

                                <div
                                    className={`card border-0 shadow-sm ${Number(message.is_read) === 0
                                        ? "border-start border-4 border-warning"
                                        : ""
                                        }`}
                                >

                                    <div className="card-body p-4">

                                        <div className="d-flex justify-content-between align-items-start">

                                            <div>

                                                <div className="d-flex align-items-center gap-2">

                                                    <h5 className="fw-bold mb-1">
                                                        {message.subject ||
                                                            "No subject"}
                                                    </h5>

                                                    {Number(
                                                        message.is_read
                                                    ) === 0 && (
                                                            <span className="badge text-bg-warning">
                                                                Unread
                                                            </span>
                                                        )}

                                                </div>

                                                <p className="text-muted mb-3">
                                                    {new Date(
                                                        message.created_at
                                                    ).toLocaleString()}
                                                </p>

                                            </div>

                                            <div className="d-flex gap-2">

                                                {Number(
                                                    message.is_read
                                                ) === 0 && (
                                                        <button
                                                            className="btn btn-sm btn-outline-success"
                                                            onClick={() =>
                                                                markAsRead(
                                                                    message.id
                                                                )
                                                            }
                                                        >
                                                            <i className="bi bi-check2 me-1"></i>
                                                            Mark Read
                                                        </button>
                                                    )}

                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() =>
                                                        deleteMessage(
                                                            message.id
                                                        )
                                                    }
                                                >
                                                    <i className="bi bi-trash me-1"></i>
                                                    Delete
                                                </button>

                                            </div>

                                        </div>


                                        <div className="row mt-3">

                                            <div className="col-md-4">

                                                <h6 className="fw-bold">
                                                    Customer
                                                </h6>

                                                <p className="mb-1">
                                                    <i className="bi bi-person me-2"></i>
                                                    {message.name}
                                                </p>

                                                <p className="mb-1 text-muted">
                                                    <i className="bi bi-envelope me-2"></i>
                                                    {message.email}
                                                </p>

                                                {message.phone && (
                                                    <p className="mb-1 text-muted">
                                                        <i className="bi bi-telephone me-2"></i>
                                                        {message.phone}
                                                    </p>
                                                )}

                                            </div>


                                            <div className="col-md-8">

                                                <h6 className="fw-bold">
                                                    Message
                                                </h6>

                                                <div className="bg-light rounded p-3">
                                                    {message.message}
                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}

export default Messages;