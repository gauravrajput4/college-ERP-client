import { Upload } from "lucide-react";

const FileUpload = ({ file, onChange, accept = "*" }) => (
  <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-6 text-center hover:bg-primary/10">
    <Upload className="mb-2 text-primary" />
    <p className="text-sm font-medium text-slate-700">Drag & drop or click to upload</p>
    <p className="text-xs text-slate-500">{file ? file.name : "No file selected"}</p>
    <input
      type="file"
      className="hidden"
      accept={accept}
      onChange={(e) => onChange(e.target.files?.[0] || null)}
    />
  </label>
);

export default FileUpload;
