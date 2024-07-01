import React from "react";

const NotesRow = ({
  notes,
  field,
}: {
  notes: { description: string; date: Date }[];
  field: any;
}) => {
  if (field === "date")
    return (
      <div>
        {notes.map((note) => {
            
            const date = new Date(note.date).toLocaleDateString("en-In")
            return (
                <div key={note.description} className="p-1">
                    {date}
                </div>
            );
        })}
      </div>
    );
    if(field === 'description'){
        return<div>
            {
                notes.map(note=>(
                    <div key={note.description} className="p-1">
                        {note.description}
                    </div>
                ))
            }
        </div>
    }
};

export default NotesRow;
