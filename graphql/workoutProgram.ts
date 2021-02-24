import { gql } from '@apollo/client'

export const OFFICIAL_WORKOUT_PROGRAMS_QUERY = gql`
  query officialWorkoutPrograms {
    officialWorkoutPrograms {
      id
      createdAt
      name
      description
      imageUrl
      videoUrl
      videoThumbUrl
      youtubeVideoUrl
      scope
    }
  }
`