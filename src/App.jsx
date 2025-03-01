import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, updateAnecdote } from './requests'
import { useNotificationDispatch } from './NotificationContext'

import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'

const App = () => {

    const queryClient = useQueryClient()
    const dispatch = useNotificationDispatch()
  
    const updateAnecMutation = useMutation({
      mutationFn: updateAnecdote,
      onSuccess: (updatedAnecdote) => {
        const anecdotes = queryClient.getQueryData(['anecdotes'])
        const newAnecdotes = anecdotes.map(anec => anec.id === updatedAnecdote.id ? updatedAnecdote : anec)
        queryClient.setQueryData(['anecdotes'], newAnecdotes)
      }
    })

  const handleVote = (anecdote) => {
    console.log('vote')
    const updatedAnecdote = {...anecdote, votes : anecdote.votes + 1}    
    updateAnecMutation.mutate(updatedAnecdote)

    dispatch({ type: 'SET', payload: `you voted for "${anecdote.content}" anecdote`})
    setTimeout(() => {
      dispatch({ type: 'SET', payload: ''})
    }, 5000)

  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    refetchOnWindowFocus: false,
    retry: false
  })
  console.log(JSON.parse(JSON.stringify(result)))

  if ( result.isLoading ) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>Anecdote service is not avaliable due problems in the server</div>
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
