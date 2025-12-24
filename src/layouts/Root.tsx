import { useQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { getSelf } from '../http/api'
import { useAuthStore } from '../store'
import type { User } from '../types'

const getSelfUser = async () => {
    const {data} = await getSelf();
    return data;
}

export default function Root() {
    const {setUser} = useAuthStore();
    const {data, isLoading} = useQuery({
        queryKey: ['self'],
        queryFn: getSelfUser
    })

    useEffect(()=> {
        if(data) {
            setUser(data as unknown as User);
        }
    }, [data, setUser])

    if(isLoading) {
        return <div>
            Loading...
        </div>
    }
  return <Outlet/>
}
