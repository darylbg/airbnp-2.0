import React from 'react'

export default function index({handleSignInRegisterToggle}) {
  return (
    <div>
      register
      <button>register</button>
      <div className="">
        <p>
          Already have an account?
          <span onClick={handleSignInRegisterToggle}>
            <strong> Sign in here</strong>
          </span>
        </p>
      </div>
    </div>
  )
}
