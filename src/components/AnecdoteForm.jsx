import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotificationDispatch } from '../NotificationContext'
import { createAnecdote } from '../requests'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''

    if (content.length < 5) {
      dispatch({ type: 'SET', payload: 'Anecdote must be at least 5 characters long' })

      setTimeout(() => {
        dispatch({ type: 'SET', payload: ''})
      }, 5000)

      return
    }


    const newAnecdote = {content, votes: 0}
    newAnecdoteMutation.mutate(newAnecdote)
    dispatch({ type: 'SET', payload: `Anecdote "${content}" created`})
    setTimeout(() => {
      dispatch({ type: 'SET', payload: ''})
    }, 5000)
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
