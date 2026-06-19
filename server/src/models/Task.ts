import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description?: string;
  project: mongoose.Types.ObjectId;
  assignee?: mongoose.Types.ObjectId;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  createdAt: Date;
}

const TaskSchema = new Schema<ITask>({
  title:       { type: String, required: true, trim: true },
  description: { type: String },
  project:     { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  assignee:    { type: Schema.Types.ObjectId, ref: 'User' },
  status:      { type: String, enum: ['todo', 'in-progress', 'review', 'done'], default: 'todo' },
  priority:    { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  dueDate:     { type: Date },
}, { timestamps: true });

export default mongoose.model<ITask>('Task', TaskSchema);