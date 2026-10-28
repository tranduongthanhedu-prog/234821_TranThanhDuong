
import { useEffect, useState } from "react";
import "./App.css";

const API = "/api/books";

const emptyBook = {
  bookId: "",
  title: "",
  author: "",
  category: "",
  publisher: "",
  publishYear: "",
  isbn: "",
  quantity: "",
  description: ""
};

export default function App() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState(emptyBook);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadBooks() {
    try {
      const response = await fetch(API);
      if (!response.ok) {
        throw new Error("Khong tai duoc danh sach");
      }
      setBooks(await response.json());
      setError("");
    } catch (err) {
      setError("Khong ket noi duoc backend: " + err.message);
    }
  }

  useEffect(() => {
    loadBooks();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function resetForm() {
    setForm({ ...emptyBook });
    setEditing(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const url = editing
        ? `${API}/${encodeURIComponent(form.bookId)}`
        : API;

      const response = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          publishYear: Number(form.publishYear),
          quantity: Number(form.quantity)
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Luu sach that bai");
      }

      setMessage(editing
        ? "Cap nhat sach thanh cong!"
        : "Them sach thanh cong!");

      resetForm();
      await loadBooks();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleEdit(book) {
    setForm({
      bookId: book.bookId,
      title: book.title,
      author: book.author,
      category: book.category || "",
      publisher: book.publisher || "",
      publishYear: book.publishYear ?? "",
      isbn: book.isbn || "",
      quantity: book.quantity ?? "",
      description: book.description || ""
    });

    setEditing(true);
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(bookId) {
    const confirmed = window.confirm(
      `Ban co chac muon xoa sach ${bookId}?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API}/${encodeURIComponent(bookId)}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Xoa sach that bai");
      }

      if (editing && form.bookId === bookId) {
        resetForm();
      }

      setMessage("Xoa sach thanh cong!");
      setError("");
      await loadBooks();
    } catch (err) {
      setError(err.message);
    }
  }

  const fields = [
    { name: "bookId", label: "Ma sach", required: true },
    { name: "title", label: "Ten sach", required: true },
    { name: "author", label: "Tac gia", required: true },
    { name: "category", label: "The loai" },
    { name: "publisher", label: "Nha xuat ban" },
    { name: "publishYear", label: "Nam xuat ban", type: "number" },
    { name: "isbn", label: "ISBN" },
    { name: "quantity", label: "So luong", type: "number" },
    { name: "description", label: "Mo ta" }
  ];

  return (
    <div className="container">
      <header>
        <h1>HE THONG QUAN LY SACH</h1>
        <p>Ung dung quan ly sach tren nen tang dam may</p>
        <p>Tran Thanh Duong - MSSV: 234821</p>
      </header>

      <section className="panel">
        <h2>{editing ? "Chinh sua sach" : "Them sach moi"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {fields.map(field => (
              <label key={field.name}>
                {field.label}

                {field.name === "description" ? (
                  <textarea
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                  />
                ) : (
                  <input
                    name={field.name}
                    type={field.type || "text"}
                    value={form[field.name]}
                    onChange={handleChange}
                    required={field.required || false}
                    readOnly={editing && field.name === "bookId"}
                    min={field.name === "quantity" ? 0 : undefined}
                  />
                )}
              </label>
            ))}
          </div>

          <div className="actions">
            <button type="submit">
              {editing ? "Luu thay doi" : "Them sach"}
            </button>

            <button
              type="button"
              className="secondary"
              onClick={resetForm}
            >
              Lam moi
            </button>
          </div>
        </form>
      </section>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      <section className="panel">
        <div className="heading">
          <h2>Danh sach sach ({books.length})</h2>
          <button onClick={loadBooks}>Tai lai</button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ma sach</th>
                <th>Ten sach</th>
                <th>Tac gia</th>
                <th>The loai</th>
                <th>NXB</th>
                <th>Nam</th>
                <th>ISBN</th>
                <th>So luong</th>
                <th>Mo ta</th>
                <th>Thao tac</th>
              </tr>
            </thead>

            <tbody>
              {books.map(book => (
                <tr key={book._id || book.bookId}>
                  <td>{book.bookId}</td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.category}</td>
                  <td>{book.publisher}</td>
                  <td>{book.publishYear}</td>
                  <td>{book.isbn}</td>
                  <td>{book.quantity}</td>
                  <td>{book.description}</td>
                  <td>
                    <div className="actions">
                      <button onClick={() => handleEdit(book)}>
                        Sua
                      </button>
                      <button
                        className="danger"
                        onClick={() => handleDelete(book.bookId)}
                      >
                        Xoa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {books.length === 0 && <p>Chua co sach nao.</p>}
        </div>
      </section>
    </div>
  );
}
