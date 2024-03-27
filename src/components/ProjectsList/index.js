import './index.css'

const ProjectsList = props => {
  const {projectDetails} = props
  const {name, imageUrl} = projectDetails
  return (
    <li className="list-container">
      <img src={imageUrl} alt={name} className="image" />
      <p className="name">{name}</p>
    </li>
  )
}

export default ProjectsList
