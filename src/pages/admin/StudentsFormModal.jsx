import Modal from "../../components/Modal";

const StudentsFormModal = ({
  modalOpen,
  onClose,
  editing,
  form,
  setForm,
  handleSubmit,
  isSubmitting,
}) => {
  const classOptions = Array.from({ length: 12 }, (_, i) => String(i + 1));
  const sectionOptions = ["A", "B", "C", "D"];

  return (
    <Modal isOpen={modalOpen} onClose={onClose} title={editing ? "Edit Student" : "Add Student"}>
      <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
        <input className="rounded border px-3 py-2" placeholder="Name" value={form.user.name} onChange={(event) => setForm((prev) => ({ ...prev, user: { ...prev.user, name: event.target.value } }))} />
        <input className="rounded border px-3 py-2" placeholder="Email" value={form.user.email} onChange={(event) => setForm((prev) => ({ ...prev, user: { ...prev.user, email: event.target.value } }))} />
        {!editing ? (
          <input className="rounded border px-3 py-2" type="password" placeholder="Password" value={form.user.password} onChange={(event) => setForm((prev) => ({ ...prev, user: { ...prev.user, password: event.target.value } }))} />
        ) : null}
        <input className="rounded border px-3 py-2" placeholder="Phone" value={form.user.phone} onChange={(event) => setForm((prev) => ({ ...prev, user: { ...prev.user, phone: event.target.value } }))} />
        <input className="rounded border px-3 py-2" placeholder="Roll No" value={form.student.rollNo} onChange={(event) => setForm((prev) => ({ ...prev, student: { ...prev.student, rollNo: event.target.value } }))} />
        <select
          className="rounded border px-3 py-2"
          value={form.student.class}
          onChange={(event) => setForm((prev) => ({ ...prev, student: { ...prev.student, class: event.target.value } }))}
        >
          <option value="">Select Class</option>
          {classOptions.map((value) => (
            <option key={value} value={value}>
              Class {value}
            </option>
          ))}
        </select>
        <select
          className="rounded border px-3 py-2"
          value={form.student.section}
          onChange={(event) => setForm((prev) => ({ ...prev, student: { ...prev.student, section: event.target.value } }))}
        >
          <option value="">Select Section</option>
          {sectionOptions.map((value) => (
            <option key={value} value={value}>
              Section {value}
            </option>
          ))}
        </select>
        <input className="rounded border px-3 py-2" placeholder="Father Name" value={form.student.fatherName} onChange={(event) => setForm((prev) => ({ ...prev, student: { ...prev.student, fatherName: event.target.value } }))} />
        <button type="submit" disabled={isSubmitting} className="col-span-full rounded bg-primary px-4 py-2 text-white disabled:opacity-70">
          {editing ? "Update" : "Create"}
        </button>
      </form>
    </Modal>
  );
};

export default StudentsFormModal;

