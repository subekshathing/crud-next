import React from "react";
import { pool } from "@/app/utils/dbConnect";
import dbConnect from "@/app/utils/dbConnect";
import { redirect } from "next/navigation";

export default async function edit({ params }) {
  dbConnect();
  const id = params.id;

  // Fetch the note from the database
  const data = await pool.query("SELECT * FROM notes WHERE id = $1", [id]);
  const result = data.rows[0];

  // Check if the note exists
  if (!result) {
    console.log(`Note with id ${id} not found.`);
    redirect("/404"); // Redirect to a 404 page or display a message
    return null;
  }

  async function updateNote(data) {
    "use server";
    let note = data.get("note").valueOf();
    let date = data.get("date").valueOf();

    try {
      const updatedNote = await pool.query(
        "UPDATE notes SET note = $1, date = $2 WHERE id = $3 RETURNING *",
        [note, date, id]
      );
      console.log("Note updated:", updatedNote.rows[0]);
    } catch (err) {
      console.error("Error in update:", err);
    }
    redirect("/");
  }

  return (
    <main className="m-10">
      <div className="m-5">
        <h1 className="text-center m-5">Edit note</h1>
        <form action={updateNote} className="space-y-5">
          <input
            type="text"
            name="note"
            id="note"
            className="shadow-lg rounded-md shadow-black h-10 p-3 w-full"
            placeholder="add note"
            defaultValue={result.note}
          />
          <input
            type="date"
            name="date"
            id="date"
            className="shadow-lg rounded-md shadow-black h-10 p-3 w-full"
            placeholder="add date"
            defaultValue={result.date}
          />
          <button
            type="submit"
            className="bg-orange-500 font-bold text-white hover:bg-red-600 p-3 rounded-md"
          >
            EDIT
          </button>
        </form>
      </div>
    </main>
  );
}
