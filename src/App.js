import {Component} from 'react'
import Loader from 'react-loader-spinner'
import ProjectsList from './components/ProjectsList'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './App.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const appStatusConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class App extends Component {
  state = {
    data: [],
    appStatus: appStatusConstant.initial,
    select: 'ALL',
  }

  componentDidMount = () => {
    this.getData()
  }

  getData = async () => {
    this.setState({
      appStatus: appStatusConstant.inProgress,
    })
    const {select} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${select}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updateData = data.projects.map(eachData => ({
        id: eachData.id,
        name: eachData.name,
        imageUrl: eachData.image_url,
      }))
      this.setState({data: updateData, appStatus: appStatusConstant.success})
    } else {
      this.setState({
        appStatus: appStatusConstant.failure,
      })
    }
  }

  selectData = event => {
    this.setState({select: event.target.value}, this.getData)
  }

  loadingView = () => (
    <div data-testid="loader" className="loader">
      <Loader type="ThreeDots" color=" #328af2" height={50} width={50} />
    </div>
  )

  successView = () => {
    const {data} = this.state
    return (
      <div className="container">
        <ul className="list-container">
          {data.map(each => (
            <ProjectsList projectDetails={each} key={each.id} />
          ))}
        </ul>
      </div>
    )
  }

  failureView = () => (
    <div className="fail-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-view"
      />
      <h1 className="heading">Oops! Something Went Wrong</h1>
      <p className="para">
        We cannot seem to find the page you are looking for
      </p>
      <button className="button" type="button" onClick={this.getData}>
        Retry
      </button>
    </div>
  )

  renderGetData = () => {
    const {appStatus} = this.state
    switch (appStatus) {
      case appStatusConstant.success:
        return this.successView()
      case appStatusConstant.inProgress:
        return this.loadingView()
      case appStatusConstant.failure:
        return this.failureView()
      default:
        return null
    }
  }

  render() {
    const {select} = this.state

    return (
      <div className="app-container">
        <nav className="nav-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="website-logo"
          />
        </nav>
        <div className="main-container">
          <ul className="select-container">
            <select
              className="select"
              value={select}
              onChange={this.selectData}
            >
              {categoriesList.map(eachItem => (
                <option value={eachItem.id} key={eachItem.id}>
                  {eachItem.displayText}
                </option>
              ))}
            </select>
          </ul>
          {this.renderGetData()}
        </div>
      </div>
    )
  }
}

export default App
