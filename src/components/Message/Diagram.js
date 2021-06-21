import React, {useState} from 'react'
import {Box, Label, Code, Popover, Text} from '@sanity/ui'

import styles from './diagram.module.css'

export default function Diagram() {
  const [pop, setPop] = useState(``)

  return (
    <>
      <div className={styles.root}>
        <div className={styles.linewrap}>
          <Code size={1}>main</Code>
        </div>
        <div onMouseEnter={() => setPop('new')} onMouseLeave={() => setPop(``)}>
          <Popover
            content={<Text size={1}>New Draft Article</Text>}
            padding={2}
            placement="top"
            portal
            open={pop === 'new'}
          >
            <div className={styles.dotbig} />
          </Popover>
        </div>
        <div className={styles.linewrap}>
          <div className={styles.line} />
        </div>
        <div onMouseEnter={() => setPop('draftPrevious')} onMouseLeave={() => setPop(``)}>
          <Popover
            content={<Text size={1}>Draft, Previously Published Article</Text>}
            padding={2}
            placement="top"
            portal
            open={pop === 'draftPrevious'}
          >
            <div className={styles.dot} />
          </Popover>
        </div>
        <div className={styles.linewrap}>
          <div className={styles.line} />
        </div>
        <div onMouseEnter={() => setPop('published')} onMouseLeave={() => setPop(``)}>
          <Popover
            content={<Text size={1}>Published Article</Text>}
            padding={2}
            placement="top"
            portal
            open={pop === 'published'}
          >
            <div className={styles.dotbig} />
          </Popover>
        </div>
        <div className={styles.linewrap}>
          <div className={styles.line} />
        </div>
        <div onMouseEnter={() => setPop('draftLive')} onMouseLeave={() => setPop(``)}>
          <Popover
            content={<Text size={1}>Draft, Live Article</Text>}
            padding={2}
            placement="top"
            portal
            open={pop === 'draftLive'}
          >
            <div className={styles.dot} />
          </Popover>
        </div>
        <div className={styles.linewrap}>
          <div className={styles.line} />
        </div>
        <div onMouseEnter={() => setPop('live')} onMouseLeave={() => setPop(``)}>
          <Popover
            content={<Text size={1}>Live Article</Text>}
            padding={2}
            placement="top"
            portal
            open={pop === 'live'}
          >
            <div className={styles.dotbig} />
          </Popover>
        </div>
      </div>
      <div className={styles.root}>
        <div className={styles.linewrap}>
          <Code size={1}>branch</Code>
        </div>
        <div />
        <div />

        <div onMouseEnter={() => setPop('draftPrevious')} onMouseLeave={() => setPop(``)}>
          <Popover
            content={<Text size={1}>Draft, Previously Published Article</Text>}
            padding={2}
            placement="top"
            portal
            open={pop === 'draftPrevious'}
          >
            <div className={styles.dot} />
          </Popover>
        </div>
        <div className={styles.linewrap}>
          <div className={styles.line} />
          <div className={styles.dot} />
        </div>
        <div />
        <div className={styles.linewrap}>
          <div className={styles.dot} style={{left: 0, right: 'auto'}} />
          <div className={styles.line} />
        </div>
        <div onMouseEnter={() => setPop('draftLive')} onMouseLeave={() => setPop(``)}>
          <Popover
            content={<Text size={1}>Draft, Live Article</Text>}
            padding={2}
            placement="top"
            portal
            open={pop === 'draftLive'}
          >
            <div className={styles.dot} />
          </Popover>
        </div>
        <div />
        <div />
      </div>
    </>
  )
}
