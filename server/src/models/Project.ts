import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description?: string;
  owner: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  status: 'active' | 'completed' | 'archived';
  createdAt: Date;
}

const ProjectSchema = new Schema<IProject>({
  name:        { type: String, required: true, trim: true },
  description: { type: String },
  owner:       { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members:     [{ type: Schema.Types.ObjectId, ref: 'User' }],
  status:      { type: String, enum: ['active', 'completed', 'archived'], default: 'active' },
}, { timestamps: true });

export default mongoose.model<IProject>('Project', ProjectSchema);