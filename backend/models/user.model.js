import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // Full name
  name: {
    type: String,
    required: true
  },
  // Username
  email: {
    type: String,
    required: true,
    unique: true // Ensure email is unique
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'rather not say'],
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'teacher'],
    required: true
  },
  // Profile picture
  avatar: {
    type: String,
    default: ""
  },
  // Multiple courses and batches for teachers
  courses: {
    type: [String], // Array of course names
    required: function() { return this.role === 'teacher'; },
    enum: [
      'Graphics Designing',
      'Web and App Development',
      'Tecno Kids',
      'UI UX Designing',
      'Generative AI & Chatbox',
      'Digital Marketing',
      'Amazon Mastery'
    ]
  },
  batches: {
    type: [String], // Array of batch names
    required: function() { return this.role === 'teacher'; },
    enum: [
      'Batch 11',
      'Batch 12',
      'Batch 13',
      'Batch 14',
      'Batch 15',
      'Batch 16',
      'Batch 17'
    ]
  },
  // Single course and batch for students
  course: {
    type: String,
    required: function() { return this.role === 'student'; },
    enum: [
      'Graphics Designing',
      'Web and App Development',
      'Tecno Kids',
      'UI UX Designing',
      'Generative AI & Chatbox',
      'Digital Marketing',
      'Amazon Mastery'
    ]
  },
  batch: {
    type: String,
    required: function() { return this.role === 'student'; },
    enum: [
      'Batch 11',
      'Batch 12',
      'Batch 13',
      'Batch 14',
      'Batch 15',
      'Batch 16',
      'Batch 17'
    ]
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // Not required at signup for students
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
