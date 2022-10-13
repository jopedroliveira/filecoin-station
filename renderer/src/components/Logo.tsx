import { useEffect, useState } from 'react'
import { useSpring, animated, useTransition } from 'react-spring'

const TopBox = () => {
  return (
    <g>
      <path d="M228.292 151.494H134.708L88.3984 184.89V130.743L125.464 103.758H228.292V151.494Z" fill="#2A1CF7" />
    </g>
  )
}

const BottomBox = () => {
  return (
    <g>
      <path d="M88.3984 198.663H181.983L228.292 165.268V219.422L191.226 246.399H88.3984V198.663Z" fill="#2A1CF7" />
    </g>
  )
}

const StationText = () => {
  return (
    <g>
      <path d="M314.291 196.951C295.478 196.951 288.449 189.255 288.449 176.072H300.298C300.298 184.066 304.295 186.586 314.667 186.586C322.292 186.586 324.812 184.811 324.812 181.993C324.812 178.216 318.444 176.512 310.812 173.921C299.78 170.222 290.82 167.254 290.82 157.038C290.82 148.15 297.856 143.266 311.331 143.266C327.325 143.266 334.51 151.409 334.51 161.781H322.661C322.661 155.413 317.777 153.638 311.331 153.638C305.999 153.638 302.669 154.816 302.669 157.486C302.669 159.85 303.926 160.744 312.296 163.556C321.923 166.814 336.661 170.96 336.661 181.844C336.661 190.803 330.364 196.944 314.298 196.944L314.291 196.951Z" fill="#2A1CF7" />
      <path d="M382.653 154.376H365.621V196.22H353.772V154.376H336.67V144.004H382.66V154.376H382.653Z" fill="#2A1CF7" />
      <path d="M416.055 179.472H394.877L390.213 196.213H378.215L393.244 144.004H417.68L432.788 196.213H420.79L416.048 179.472H416.055ZM413.165 169.107L406.946 146.964H403.986L397.767 169.107H413.172H413.165Z" fill="#2A1CF7" />
      <path d="M473.602 154.376H456.57V196.22H444.722V154.376H427.619V144.004H473.609V154.376H473.602Z" fill="#2A1CF7" />
      <path d="M503.973 154.376V185.848H515.822V196.22H480.275V185.848H492.124V154.376H480.275V144.004H515.822V154.376H503.973Z" fill="#2A1CF7" />
      <path d="M545.455 143.266C561.968 143.266 572.042 154.894 572.042 170.073C572.042 185.251 561.968 196.951 545.455 196.951C528.942 196.951 518.797 185.33 518.797 170.073C518.797 154.816 528.871 143.266 545.455 143.266ZM545.455 186.586C555.302 186.586 560.193 180.14 560.193 170.073C560.193 160.006 555.309 153.638 545.455 153.638C535.601 153.638 530.646 160.077 530.646 170.073C530.646 180.069 535.608 186.586 545.455 186.586Z" fill="#2A1CF7" />
      <path d="M579.451 144.004H602.78L618.555 193.252H621.515L619.293 185.848V144.004H631.142V196.213H607.813L592.038 146.964H589.078L591.3 154.369V196.213H579.451V144.004Z" fill="#2A1CF7" />
    </g>
  )
}

const Logo = () => {
  const [toggle, setToggle] = useState<boolean>(false)

  useEffect(() => {
    setInterval(() => setToggle(true), 200)
  })

  const springUp = useSpring({ transform: toggle ? 'translate3d(0px, 0xp, 0px)' : 'translate3d(0px, 31px, 0px)', config: { duration: 300 } })
  const springDown = useSpring({ transform: toggle ? 'translate3d(0px, 0px, 0px)' : 'translate3d(0px, -31px, 0px)', config: { duration: 300 } })
  const springLeft = useSpring({ transform: toggle ? 'translate3d(0px, 0xp, 0px)' : 'translate3d(247.58px, 0px, 0px)', delay: 1000, config: { duration: 300 } })
  const transitions = useTransition(toggle, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    delay: 1000,
    config: { duration: 500 }
  })
  return (
    <>
      <svg width="720" height="350" viewBox="0 0 720 350" fill="none" xmlns="http://www.w3.org/2000/svg">
        <animated.g style={springUp}><animated.g style={springLeft}><TopBox /></animated.g></animated.g>
        <animated.g style={springDown}><animated.g style={springLeft}><BottomBox /></animated.g></animated.g>
        {transitions(({ opacity }, item) => (
          <animated.g style={springLeft}>
            <animated.g
              style={{
                opacity: opacity.to({ range: [0.0, 1.0], output: [0, 1] })
              }}>
              <StationText />
            </animated.g>
          </animated.g>
        )
        )}

      </svg>
    </>
  )
}

export default Logo
