import { CATEGORIES } from '../../data/projects.js'

export default function CategoryFilter({
  activeCategory,
  pinnedCategory,
  onCategoryHover,
  onCategoryToggle,
  className,
}) {
  return (
    <div
      className={`category-filter${className ? ` ${className}` : ''}`}
      role="group"
      aria-label="Filter projects by role"
    >
      {CATEGORIES.map((category, index) => (
        <span key={category} className="category-filter__item">
          {index > 0 && (
            <span className="category-filter__sep" aria-hidden="true">
              |
            </span>
          )}
          <button
            type="button"
            className="category-filter__button"
            aria-pressed={pinnedCategory === category}
            data-active={activeCategory === category || undefined}
            onMouseEnter={() => onCategoryHover(category)}
            onMouseLeave={() => onCategoryHover(null)}
            onFocus={() => onCategoryHover(category)}
            onBlur={() => onCategoryHover(null)}
            onClick={() => onCategoryToggle(category)}
          >
            {category}
          </button>
        </span>
      ))}
    </div>
  )
}
