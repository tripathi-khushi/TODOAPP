import React from 'react';
import { Filter, ArrowUpDown, Layers, Plus } from 'lucide-react';

export const FilterBar = ({
  statusFilter,
  onStatusChange,
  categoryFilter,
  onCategoryChange,
  priorityFilter,
  onPriorityChange,
  sortBy,
  onSortChange,
  onOpenAddModal,
  totalCount = 0
}) => {
  const statusTabs = ['All', 'Pending', 'In Progress', 'Completed'];
  const categories = ['All', 'Academic', 'Projects', 'Personal', 'Work', 'Design'];
  const priorities = ['All', 'Low', 'Medium', 'High', 'Urgent'];

  return (
    <div className="filter-bar-container">
      {/* Top Row: Status Tabs */}
      <div className="filter-top-row">
        <div className="status-tabs-pill-group">
          {statusTabs.map((tab) => (
            <button
              key={tab}
              className={`status-tab-btn ${statusFilter === tab ? 'active' : ''}`}
              onClick={() => onStatusChange(tab)}
              id={`filter-status-${tab.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <span>{tab}</span>
              {tab === 'All' && <span className="tab-count-badge">{totalCount}</span>}
            </button>
          ))}
        </div>

        {/* New Task Trigger Button */}
        <button
          className="btn-pill btn-primary quick-add-trigger"
          onClick={onOpenAddModal}
          id="btn-quick-add"
        >
          <Plus size={15} />
          <span>Add Task</span>
        </button>
      </div>

      {/* Bottom Row: Secondary Filters & Sorters */}
      <div className="filter-secondary-row">
        <div className="secondary-filters-left">
          {/* Category Dropdown */}
          <div className="select-pill-wrapper">
            <Layers size={13} className="select-icon" />
            <select
              className="select-pill"
              value={categoryFilter}
              onChange={(e) => onCategoryChange(e.target.value)}
              id="filter-category-select"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  Category: {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Dropdown */}
          <div className="select-pill-wrapper">
            <Filter size={13} className="select-icon" />
            <select
              className="select-pill"
              value={priorityFilter}
              onChange={(e) => onPriorityChange(e.target.value)}
              id="filter-priority-select"
            >
              {priorities.map((pri) => (
                <option key={pri} value={pri}>
                  Priority: {pri}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort Sorter */}
        <div className="select-pill-wrapper sort-wrapper">
          <ArrowUpDown size={13} className="select-icon" />
          <select
            className="select-pill"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            id="filter-sort-select"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="dueDate-asc">Due Date (Earliest)</option>
            <option value="dueDate-desc">Due Date (Latest)</option>
            <option value="title-asc">Title (A-Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
export default FilterBar;
