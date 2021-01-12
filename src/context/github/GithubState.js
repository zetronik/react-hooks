import React, {useReducer} from 'react'
import axios from 'axios'
import {GithubContext} from './githubContext'
import {GithubReducer} from './GithubReducer'
import {CLEAR_USERS, GET_REPOS, GET_USER, SEARCH_USERS, SET_LOADING} from '../types'

const ID = process.env.REACT_APP_CLIENT_ID
const SECRET = process.env.REACT_APP_CLIENT_SECRET
const auth = `client_id=${ID}&client_secret=${SECRET}`

export const GithubState = ({children}) => {
    const initialState = {
        user: {},
        users: [],
        loading: false,
        repos: []
    }
    const [state, dispatch] = useReducer(GithubReducer, initialState)

    const search = async value => {
        setLoading()
        const res = await axios.get(
            `https://api.github.com/search/users?q=${value}&${auth}`
        )
        dispatch({type: SEARCH_USERS, payload: res.data.items})
    }

    const getUser = async name => {
        setLoading()
        const res = await axios.get(
            `https://api.github.com/users/${name}?${auth}`
        )
        dispatch({type: GET_USER, payload: res.data})
    }

    const getRepos = async name => {
        setLoading()
        const res = await axios.get(
            `https://api.github.com/users/${name}/repos?${auth}`
        )
        dispatch({type: GET_REPOS, payload: res.data})
    }

    const clearUsers = () => dispatch({type: CLEAR_USERS})
    const setLoading = () => dispatch({type: SET_LOADING})

    const {user, users, repos, loading} = state

    return (
        <GithubContext.Provider value={{
            search, getUser, getRepos, clearUsers, setLoading, user, users, repos, loading
        }}>
            {children}
        </GithubContext.Provider>
    )
}