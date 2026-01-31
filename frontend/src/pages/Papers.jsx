import { useState, useEffect } from 'react';
import { Plus, FileText, X, Users, Calendar, ExternalLink, Edit2, Trash2 } from 'lucide-react';
import { paperAPI, userAPI } from '../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import useAuthStore from '../store/authStore';
import UserSelector from '../components/UserSelector';

export default function Papers() {
  const { user } = useAuthStore();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPaper, setEditingPaper] = useState(null);
  const [filter, setFilter] = useState('all');
  const [allUsers, setAllUsers] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    status: 'in-progress',
    venue: {
      name: '',
      type: 'conference'
    },
    keywords: '',
    authors: [{
      name: user?.name || '',
      role: 'lead'
    }],
    selectedAuthorIds: []
  });

  useEffect(() => {
    fetchPapers();
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAll();
      setAllUsers(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchPapers = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await paperAPI.getAll(params);
      setPapers(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch papers');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('venue.')) {
      const venueField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        venue: { ...prev.venue, [venueField]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Build authors array from selected user IDs with names
      const authorsFromSelection = formData.selectedAuthorIds.map(userId => {
        const selectedUser = allUsers.find(u => u._id === userId);
        return {
          user: userId,
          name: selectedUser?.name || 'Unknown',
          role: 'co-author'
        };
      }).filter(author => author.name !== 'Unknown');

      const submitData = {
        ...formData,
        keywords: typeof formData.keywords === 'string'
          ? formData.keywords.split(',').map(k => k.trim()).filter(Boolean)
          : formData.keywords,
        // Combine current user as lead + selected co-authors
        authors: [
          { user: user._id, name: user.name, role: 'lead' },
          ...authorsFromSelection
        ]
      };

      // Remove selectedAuthorIds from submitData
      delete submitData.selectedAuthorIds;

      if (editingPaper) {
        await paperAPI.update(editingPaper._id, submitData);
        toast.success('Paper updated successfully!');
      } else {
        await paperAPI.create(submitData);
        toast.success('Paper created successfully!');
      }
      setShowModal(false);
      setEditingPaper(null);
      resetForm();
      fetchPapers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (paper) => {
    setEditingPaper(paper);
    // Extract co-author IDs (exclude current user)
    const coAuthorIds = (paper.authors || [])
      .filter(a => a.user?._id !== user?.id && a.role !== 'lead')
      .map(a => a.user?._id || a.user)
      .filter(Boolean);

    setFormData({
      title: paper.title,
      abstract: paper.abstract || '',
      status: paper.status,
      venue: {
        name: paper.venue?.name || '',
        type: paper.venue?.type || 'conference'
      },
      keywords: Array.isArray(paper.keywords) ? paper.keywords.join(', ') : '',
      authors: paper.authors || [{ name: user?.name || '', role: 'lead' }],
      selectedAuthorIds: coAuthorIds
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this paper?')) return;
    
    try {
      await paperAPI.delete(id);
      toast.success('Paper deleted successfully!');
      fetchPapers();
    } catch (error) {
      toast.error('Failed to delete paper');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      abstract: '',
      status: 'in-progress',
      venue: { name: '', type: 'conference' },
      keywords: '',
      authors: [{ name: user?.name || '', role: 'lead' }],
      selectedAuthorIds: []
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPaper(null);
    resetForm();
  };

  const statusColors = {
    'in-progress': 'bg-blue-100 text-blue-800',
    'submitted': 'bg-purple-100 text-purple-800',
    'under-review': 'bg-yellow-100 text-yellow-800',
    'revision-needed': 'bg-orange-100 text-orange-800',
    'accepted': 'bg-green-100 text-green-800',
    'published': 'bg-emerald-100 text-emerald-800',
    'rejected': 'bg-red-100 text-red-800'
  };

  const statusLabels = {
    'in-progress': 'In Progress',
    'submitted': 'Submitted',
    'under-review': 'Under Review',
    'revision-needed': 'Revision Needed',
    'accepted': 'Accepted',
    'published': 'Published',
    'rejected': 'Rejected'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark-900">Team Research Papers</h1>
          <p className="text-dark-600 mt-1">📚 Collaborative view - See all team members' publications</p>
        </div>
        <button onClick={() => { setEditingPaper(null); setShowModal(true); }} className="btn btn-primary">
          <Plus className="w-5 h-5" />
          New Paper
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'in-progress', 'submitted', 'under-review', 'accepted', 'published'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`btn ${filter === status ? 'btn-primary' : 'btn-secondary'} capitalize whitespace-nowrap`}
          >
            {status === 'all' ? 'All Papers' : statusLabels[status]}
          </button>
        ))}
      </div>

      {/* Papers List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : papers.length > 0 ? (
          papers.map((paper) => (
            <div key={paper._id} className="card p-6 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-6 h-6 text-primary-600" />
                    <h3 className="text-lg font-semibold text-dark-900">{paper.title}</h3>
                    <span className={`badge capitalize ${statusColors[paper.status]}`}>
                      {statusLabels[paper.status]}
                    </span>
                  </div>
                  {paper.abstract && (
                    <p className="text-dark-600 text-sm line-clamp-2 mb-3">{paper.abstract}</p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-dark-600">
                    {paper.authors && paper.authors.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>
                          {paper.authors.map(a => a.user?.name || a.name).join(', ')}
                        </span>
                      </div>
                    )}
                    
                    {paper.venue?.name && (
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        <span>{paper.venue.name}</span>
                      </div>
                    )}
                    
                    {paper.submissionDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Submitted: {format(new Date(paper.submissionDate), 'MMM d, yyyy')}</span>
                      </div>
                    )}
                  </div>

                  {paper.keywords && paper.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {paper.keywords.slice(0, 5).map((keyword, idx) => (
                        <span key={idx} className="px-2 py-1 bg-dark-100 text-dark-700 rounded text-xs">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons - only show if user is an author or supervisor */}
                {(paper.authors?.some(a => a.user?._id === user?.id || a.user === user?.id) ||
                  ['professor', 'admin'].includes(user?.role)) && (
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(paper)}
                      className="btn btn-ghost p-2 text-blue-600 hover:bg-blue-50"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(paper._id)}
                      className="btn btn-ghost p-2 text-red-600 hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="card p-12 text-center">
            <FileText className="w-16 h-16 text-dark-300 mx-auto mb-4" />
            <p className="text-dark-600 mb-2">No papers found</p>
            <p className="text-dark-500 text-sm">Start tracking your research by adding your first paper!</p>
          </div>
        )}
      </div>

      {/* Create/Edit Paper Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-dark-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-dark-900">
                {editingPaper ? 'Edit Paper' : 'Add New Paper'}
              </h2>
              <button onClick={handleCloseModal} className="btn btn-ghost p-2">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-2">
                  Paper Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="e.g., Deep Learning Approaches for Natural Language Processing"
                  required
                />
              </div>

              {/* Abstract */}
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-2">
                  Abstract
                </label>
                <textarea
                  name="abstract"
                  value={formData.abstract}
                  onChange={handleInputChange}
                  className="input min-h-[120px]"
                  placeholder="Brief summary of your research..."
                  rows={4}
                />
              </div>

              {/* Status and Venue Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="input"
                    required
                  >
                    <option value="in-progress">In Progress</option>
                    <option value="submitted">Submitted</option>
                    <option value="under-review">Under Review</option>
                    <option value="revision-needed">Revision Needed</option>
                    <option value="accepted">Accepted</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-2">
                    Venue Type
                  </label>
                  <select
                    name="venue.type"
                    value={formData.venue.type}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="conference">Conference</option>
                    <option value="journal">Journal</option>
                    <option value="workshop">Workshop</option>
                    <option value="arxiv">arXiv</option>
                  </select>
                </div>
              </div>

              {/* Venue Name */}
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-2">
                  Venue Name
                </label>
                <input
                  type="text"
                  name="venue.name"
                  value={formData.venue.name}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="e.g., NeurIPS 2024, Nature, ACL Workshop"
                />
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-2">
                  Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="e.g., machine learning, NLP, deep learning"
                />
                <p className="text-xs text-dark-500 mt-1">Separate keywords with commas</p>
              </div>

              {/* Co-Authors - Only for Supervisors */}
              {['professor', 'admin'].includes(user?.role) && (
                <div className="border-t border-dark-200 pt-5">
                  <UserSelector
                    selectedUsers={formData.selectedAuthorIds}
                    onChange={(users) => setFormData(prev => ({ ...prev, selectedAuthorIds: users }))}
                    multiple={true}
                    label="Add Co-Authors (Students)"
                  />
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn btn-primary flex-1">
                  <FileText className="w-5 h-5" />
                  {editingPaper ? 'Update Paper' : 'Add Paper'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
